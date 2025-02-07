import { ChangeEvent} from "react"
import { IoMdAdd } from "react-icons/io"
import type { ChangeProfilePicture } from "../../../../../type"

function ChangeProfilePicture({fileRef,emptyFileError,setSelectedFile,selectedFile}:ChangeProfilePicture) {

    const uploadFile = (e:ChangeEvent<HTMLInputElement>|null) => {
        if (e?.target?.files && e.target.files.length > 0) {
            setSelectedFile(e?.target?.files[0])
        }
    }

    const deletePicture = () => {        
        if(selectedFile && fileRef?.current){
            fileRef.current.value = ""
            setSelectedFile(null)
        }
    }

  return (
    <div className="flex gap-[15px]" >
    {selectedFile?
    <img src={URL.createObjectURL(selectedFile)} alt="newProfile" className="max-w-24 max-h-24 object-cover object-center rounded-[20px] " />
    :
    <div
    className={`flex justify-center items-center w-40 h-24 border-[1px] ${emptyFileError?"border-[#FC4747]":"border-[#fab907]"} rounded-[20px] as `}
    onClick={()=>{fileRef?.current && fileRef.current.click()}}
  >
    <IoMdAdd style={{color:`${emptyFileError?"#FC4747":"#fab907"}`}} className="w-[25px] h-[25px] " />
  </div>
}
    <input
      className="hidden"
      type="file"
      name="file"
      id="file"
      ref={fileRef}
      onChange={uploadFile}
    />
  <p className="text-[#fab907]" onClick={deletePicture} >{selectedFile?"delete picture":"Add picture"}</p>
  </div>
  )
}

export default ChangeProfilePicture