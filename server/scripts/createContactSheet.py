import pillow_avif
from pathlib import Path
from PIL import Image, ImageDraw
import math

project_root = Path(__file__).resolve().parents[2]
folder = project_root / "public" / "images" / "perfumes"
output_folder = project_root / "public" / "contact-sheets"

output_folder.mkdir(parents=True, exist_ok=True)

extensions = {".jpg", ".jpeg", ".webp", ".png", ".avif"}

files = sorted(
    p for p in folder.iterdir()
    if p.is_file() and p.suffix.lower() in extensions
)

columns = 4
per_sheet = 20
cell_w, cell_h = 300, 350
thumb_w, thumb_h = 270, 285

print(f"Found {len(files)} images.")

for start in range(0, len(files), per_sheet):
    batch = files[start:start + per_sheet]
    rows = math.ceil(len(batch) / columns)

    sheet = Image.new(
        "RGB", (columns * cell_w, rows * cell_h), "white"
    )
    draw = ImageDraw.Draw(sheet)

    for offset, path in enumerate(batch):
        x = (offset % columns) * cell_w
        y = (offset // columns) * cell_h

        try:
            with Image.open(path) as source:
                image = source.convert("RGB")
                image.thumbnail((thumb_w, thumb_h))

            px = x + (cell_w - image.width) // 2
            sheet.paste(image, (px, y + 5))

            draw.text(
                (x + 8, y + 300),
                f"{start + offset + 1}. {path.name}",
                fill="black"
            )
        except Exception as error:
            draw.text(
                (x + 8, y + 10),
                f"Error: {path.name}",
                fill="red"
            )

    page = start // per_sheet + 1
    destination = output_folder / f"sheet-{page:02}.jpg"
    sheet.save(destination, quality=95)
    print(f"Saved: {destination}")

print("All contact sheets generated.")
