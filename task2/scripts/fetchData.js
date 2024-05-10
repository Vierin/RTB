const dataURL =
    "https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json";

export async function fetchData() {
    try {
        const response = await fetch(dataURL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}
