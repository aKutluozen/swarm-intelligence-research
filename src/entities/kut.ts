export class Kut {
  x: number
  y: number
  interactionRadius: number
  radius: number
  bit: number
  direction: { x: number; y: number }
  mass: number

  constructor(x: number, y: number, interactionRadius: number, radius: number) {
    this.x = x
    this.y = y
    this.interactionRadius = interactionRadius
    this.radius = radius
    this.bit = Math.round(Math.random())
    const angle = Math.random() * 2 * Math.PI
    this.direction = { x: Math.cos(angle), y: Math.sin(angle) }
    this.mass = radius
  }

  updateDirectionAfterCollisionWith(other: Kut) {
    // Calculate the new velocities using the conservation laws
    const newVx1 =
      (this.direction.x * (this.mass - other.mass) +
        2 * other.mass * other.direction.x) /
      (this.mass + other.mass)
    const newVy1 =
      (this.direction.y * (this.mass - other.mass) +
        2 * other.mass * other.direction.y) /
      (this.mass + other.mass)
    const newVx2 =
      (other.direction.x * (other.mass - this.mass) +
        2 * this.mass * this.direction.x) /
      (this.mass + other.mass)
    const newVy2 =
      (other.direction.y * (other.mass - this.mass) +
        2 * this.mass * this.direction.y) /
      (this.mass + other.mass)

    // Update the velocities
    this.direction.x = newVx1
    this.direction.y = newVy1
    other.direction.x = newVx2
    other.direction.y = newVy2

    // Add a small displacement to avoid overlap in the next frame
    const displacement = this.radius * 3
    const angle = Math.atan2(other.y - this.y, other.x - this.x)
    this.x -= displacement * Math.cos(angle)
    this.y -= displacement * Math.sin(angle)
    other.x += displacement * Math.cos(angle)
    other.y += displacement * Math.sin(angle)
  }

  calculateNewDirectionAfterCollisionWith(other: Kut) {
    // Calculate the new velocities using the conservation laws
    const newVx =
      (this.direction.x * (this.mass - other.mass) +
        2 * other.mass * other.direction.x) /
      (this.mass + other.mass)
    const newVy =
      (this.direction.y * (this.mass - other.mass) +
        2 * other.mass * other.direction.y) /
      (this.mass + other.mass)
    return { dx: newVx, dy: newVy }
  }

  move(maxDistance: number, maxX: number, maxY: number) {
    const newX = this.x + this.direction.x * maxDistance
    const newY = this.y + this.direction.y * maxDistance

    if (newX < 0 || newX > maxX) {
      this.direction.x *= -1
    } else {
      this.x = newX
    }

    if (newY < 0 || newY > maxY) {
      this.direction.y *= -1
    } else {
      this.y = newY
    }
  }

  isNear(other: Kut): boolean {
    const dx = other.x - this.x
    const dy = other.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance <= this.interactionRadius
  }

  touches(other: Kut): boolean {
    const dx = this.x - other.x
    const dy = this.y - other.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance <= this.radius + other.radius
  }

  transferBitTo(other: Kut): void {
    if (this.bit === other.bit) {
      return
    }
    const tempBit = this.bit
    this.bit = other.bit
    other.bit = tempBit
  }
}
