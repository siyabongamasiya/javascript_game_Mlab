export class Card {
    constructor(id, backImage, frontImage) {
      this.id = id;
      this.backImage = backImage;
      this.frontImage = frontImage;
      this.isFlipped = false;
      this.isMatched = false;
    }
  }