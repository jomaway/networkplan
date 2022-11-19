export function getAssetsIconUrl(name: string) {
    return new URL("./assets/icons/" + name, import.meta.url).href;
}