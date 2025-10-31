import { useState } from "react"
import BulkUploadModal from "../components/Seller/BulkUploadModal";

const Test = () => {
  const [isModalOpen, setIsModalOpen]  = useState(false);
  return (
    <div>
      <button className="bg-red-500 h-10 w-15 m-15" onClick={() => {setIsModalOpen(true)}}>Hello World</button>
      <BulkUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Test