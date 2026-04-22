"""Genererar PNG-ikoner för PWA-manifestet och Apples hemskärm.

PWA-installation i Chrome/Edge vill ha PNG i standardstorlekarna 192 och 512,
och iOS använder apple-touch-icon i PNG. Vi skapar därför dessa från kod
så att ikonerna alltid matchar SVG-källan.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BG = (15, 15, 15, 255)        # Void Black – appens bakgrundsfärg
FG = (0, 255, 255, 255)       # Electric Cyan – accentfärg
ROOT = Path(__file__).resolve().parent.parent
ICONS = ROOT / "icons"
ICONS.mkdir(exist_ok=True)

FONT_CANDIDATES = [
    "C:/Windows/Fonts/segoeuib.ttf",   # Segoe UI Bold – finns på Windows
    "C:/Windows/Fonts/arialbd.ttf",    # Arial Bold – fallback
    "C:/Windows/Fonts/segoeui.ttf",
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    """Returnerar ett fett typsnitt i önskad storlek, med fallback."""
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_icon(size: int, maskable: bool = False) -> Image.Image:
    """Ritar en kvadratisk ikon med bokstäverna HP.

    maskable=True fyller hela canvasen med bakgrundsfärgen och håller
    texten inom den inre säkerhetszonen (80%) så att den inte beskärs
    av systemets ikonmask på Android.
    """
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    # Mindre text för maskable så att inget hamnar utanför säkerhetszonen
    text_size = int(size * (0.40 if maskable else 0.48))
    font = load_font(text_size)

    text = "HP"
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = (size - w) / 2 - bbox[0]
    y = (size - h) / 2 - bbox[1]
    draw.text((x, y), text, fill=FG, font=font)

    if maskable:
        return img

    # Avrundade hörn — matchar SVG:ns rx/ry (~15% av sidan)
    radius = int(size * 0.15)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size, size], radius=radius, fill=255
    )
    output = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    return output


def main() -> None:
    targets = [
        (192, False, "icon-192.png"),
        (512, False, "icon-512.png"),
        (512, True, "icon-maskable-512.png"),
    ]
    for size, maskable, name in targets:
        out = ICONS / name
        draw_icon(size, maskable=maskable).save(out, "PNG", optimize=True)
        print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
