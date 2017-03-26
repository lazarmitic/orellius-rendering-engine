export class TextureLoader {

	constructor() {

	}

	public loadTextures(URLs: string[], callback: Function) {

		let images: HTMLImageElement[] = []
		let image: HTMLImageElement;
		let imagesToLoad = URLs.length;

		for(let i = 0; i < URLs.length; i++) {

			image = new Image();
			images.push(image);
			image.onload = () => {

				imagesToLoad--;
				if(imagesToLoad === 0) {

					callback(images);
				}
			}
			image.src = URLs[i];
		}
	}
}
