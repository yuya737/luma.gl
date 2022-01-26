import {assert} from '../utils/assert';

let pathPrefix = '';

/**
 * Set a relative path prefix
 */
export function setPathPrefix(prefix: string) {
  pathPrefix = prefix;
}

/**
 * Reads raw file data. Respects setPathPrefix.
 */
export async function loadFile(url: string, options?: {dataType?: string} & RequestInit): Promise<any> {
  const dataType = options?.dataType || 'text';
  const response = await fetch(pathPrefix + url, options);
  return await response[dataType]();
}

/**
 * Loads ImageBitmap asynchronously. Respects setPathPrefix.
 * image.crossOrigin can be set via opts.crossOrigin, default to 'anonymous'
 * @returns a promise tracking the load
 */
export async function loadImageBitmap(url: string, opts?: {crossOrigin?: string}): Promise<ImageBitmap> {
  const img = new Image();
  img.crossOrigin = opts?.crossOrigin || 'anonymous';
  img.src = pathPrefix + url;
  await img.decode();
  return await createImageBitmap(img);
}

/**
 * Loads image asynchronously. Respects setPathPrefix.
 * image.crossOrigin can be set via opts.crossOrigin, default to 'anonymous'
 * @returns a promise tracking the load
 * @deprecated Use `loadImageBitmap()` unless you are supporting old versions of Safari.
 */
export async function loadImage(url: string, opts?: {crossOrigin}): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    try {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Could not load image ${url}.`));
      image.crossOrigin = opts?.crossOrigin || 'anonymous';
      image.src = pathPrefix + url;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Load a script (identified by an url). When the url returns, the
 * content of this file is added into a new script element, attached to the DOM (body element)
 * @param scriptUrl defines the url of the script to laod
 * @param scriptId defines the id of the script element
 */
 export function loadScript(scriptUrl: string, scriptId?: string): Promise<Event> {
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', scriptUrl);
  if (scriptId) {
    script.id = scriptId;
  }
  return new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = (error) => reject(new Error(`Unable to load script '${scriptUrl}': ${error}`));
    head.appendChild(script);
  });
}
