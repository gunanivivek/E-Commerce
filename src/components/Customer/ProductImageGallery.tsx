import React, { useState } from "react";

interface Props {
  image: string;
  images?: string[];
  thumbnails?: string[];
}

const ProductImageGallery: React.FC<Props> = ({ image, thumbnails, images }) => {
  // thumbnails -> images -> fallback to main image
  const thumbList: string[] = thumbnails ?? images ?? (image ? [image] : []);
  const [selected, setSelected] = useState(0);

  const mainSrc = thumbList[selected] ?? image;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-96 rounded-lg overflow-hidden flex items-center justify-center bg-white">
        <img src={mainSrc} alt="product" className="object-contain w-full h-full" />
      </div>

      <div className="flex gap-3 mt-4">
        {thumbList.slice(0, 6).map((img, idx) => {
          const active = idx === selected;
          return (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              aria-pressed={active}
              className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border transition-all focus:outline-none ${
                active
                  ? "border-[var(--color-primary-400)] ring-2 ring-[var(--color-primary-400)]"
                  : "border-gray-200 hover:border-[var(--color-primary-400)]"
              }`}
            >
              <img src={img} alt={`thumb-${idx}`} className="object-cover w-full h-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImageGallery;
