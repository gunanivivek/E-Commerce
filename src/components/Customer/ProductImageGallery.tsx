import React from "react";

interface Props {
  image: string;
  images?: string[];
  thumbnails?: string[];
}

const ProductImageGallery: React.FC<Props> = ({ image, thumbnails, images }) => {
  // make sure we don't call .slice on undefined at runtime
  const thumbList: string[] = thumbnails ?? images ?? (image ? [image] : []);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-96 rounded-lg overflow-hidden flex items-center justify-center">
        <img src={image} alt="product" className="object-contain w-full h-full" />
      </div>
      <div className="flex gap-3 mt-4">
        {thumbList.slice(0, 3).map((img, idx) => (
          <div
            key={idx}
            className="w-20 h-20 rounded-md border border-gray-200 hover:border-[var(--color-primary-400)] overflow-hidden cursor-pointer"
          >
            <img src={img} alt="thumb" className="object-cover w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
