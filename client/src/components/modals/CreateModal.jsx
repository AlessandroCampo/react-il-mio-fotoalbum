import { Dialog, DialogTitle, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { Textarea } from "@headlessui/react";
import Select from 'react-select';
import { useGlobal } from "../../contexts/globalContext";
import { FaCircleArrowUp as ArrowUpIcon } from "react-icons/fa6";
import customAxiosInstance from "../../axiosClient";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router";



export default function ({ open, setOpen }) {

    const formRef = useRef(null);
    const [createErrors, setcreateErrors] = useState([]);
    const { categories, notify } = useGlobal();
    const [image, setImage] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const options = categories?.map(c => {
        return { value: c.id, label: c.name }
    })
    const navgiate = useNavigate();


    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleSelectChange = (selectedOptions) => {

        setSelectedCategories(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(formRef.current);

        selectedCategories.forEach((category) => {
            formData.append('categories[]', parseInt(category.value));
        });

        try {
            const { data } = await customAxiosInstance.post(`pictures`, formData);
            console.log(data);
            notify(`Picture ${data.picture.title} has been succesfully posted`, 'success');
            setLoading(false);
            setOpen(false);
            navgiate(`/pin/${data.picture.slug}`);

        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => {
        setcreateErrors([]);
        setOpen(false)
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        // setPostMedia(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { borderRadius: 10, minWidth: 800, height: 600 }
            }}
        >
            <div className="dialog-container flex items-center p-10 flex-col h-full  text-gray-900 gap-4 relative overflow-hidden">
                <CloseIcon
                    className="absolute top-8 right-8 text-2xl"
                    onClick={handleClose}
                />

                <DialogTitle>Post your lastest picture</DialogTitle>
                <form
                    className="register flex w-full h-4/5 "
                    ref={formRef}
                    onSubmit={handleSubmit}
                >
                    <div className="create-form-left w-1/2 h-full flex items-center justify-center">
                        <label
                            htmlFor="image"
                            className={`w-full flex items-center justify-center cursor-pointer rounded-3xl overflow-hidden ${image ? '' : 'h-full'}`}
                        >
                            {image ?
                                <figure className="h-[400px] w-[300px] flex items-center justify-center flex-col gap-3 ">
                                    <img
                                        src={image}
                                        alt="your_upload"
                                        className="max-h-full max-w-full object-contain"

                                    />
                                    <p>
                                        Click on your image again to replace it
                                    </p>
                                </figure>
                                :
                                <div className="h-full w-full  bg-gray-400 flex items-center gap-2 flex-col justify-center">
                                    <ArrowUpIcon className="text-4xl" />
                                    Upload your image
                                </div>
                            }
                        </label>
                        <input
                            type="file"
                            name="image"
                            id="image"
                            hidden
                            onChange={handleFileUpload}
                            accept=".png, .jpg, .jpeg"
                        />
                    </div>

                    <div className="create-form-right flex flex-col gap-4 px-6 h-full w-1/2 justify-center">
                        <TextField
                            id="outlined-basic"
                            label="Title"
                            variant="outlined"
                            name="title"
                        />
                        {/* TODO - floating label */}
                        <Textarea
                            className='border border-gray-300 p-3'
                            placeholder="Description"
                            name="description"
                        />

                        <Select
                            isMulti
                            options={options}
                            className="basic-multi-select cursor-pointer"
                            classNamePrefix="select"
                            menuShouldScrollIntoView={false}
                            value={selectedCategories}
                            onChange={handleSelectChange}

                        />
                        {
                            createErrors && <div className="error-message text-theme max-w-full my-4">
                                {createErrors[0]}
                            </div>
                        }
                        <button
                            className="bg-theme hover:bg-themeDarker text-white text-lg font-bold py-2 px-4 rounded-full transition duration-300 mt-3"
                        >
                            {

                                loading ? <BeatLoader color="white" size={10} margin={0} /> : 'Post'
                            }
                        </button >
                    </div>


                </form >
            </div >

        </Dialog >
    )
}