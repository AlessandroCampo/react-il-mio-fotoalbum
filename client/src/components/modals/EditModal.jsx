import { Dialog, DialogTitle, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { Textarea } from "@headlessui/react";
import Select from 'react-select';
import { useGlobal } from "../../contexts/globalContext";
import { FaCircleArrowUp as ArrowUpIcon } from "react-icons/fa6";
import customAxiosInstance from "../../axiosClient";
import { BeatLoader } from "react-spinners";



export default function ({ open, setOpen }) {

    const formRef = useRef(null);
    const { toEditPicture, setToEditPicture } = useGlobal();
    const [createErrors, setcreateErrors] = useState([]);
    const { categories, notify } = useGlobal();
    const [loading, setLoading] = useState(false);
    const options = categories?.map(c => {
        return { value: c.id, label: c.name }
    })

    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleSelectChange = (selectedOptions) => {

        setSelectedCategories(selectedOptions);
    };


    useEffect(() => {
        const defaultCategories = toEditPicture?.categories?.map(c => {
            return { value: c.id, label: c.name };
        });
        setSelectedCategories(defaultCategories)
    }, [toEditPicture])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Collect form data
        const formData = {
            title: formRef.current.title.value,
            description: formRef.current.description.value,
            categories: selectedCategories.map(category => category.value)
        };

        console.log(formData); // Log the data to verify it

        try {
            const { data } = await customAxiosInstance.put(`/pictures/${toEditPicture.slug}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(data);
            notify(`Picture ${data.title} has been successfully updated`, 'success');
            setLoading(false);
            setOpen(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleClose = () => {
        setToEditPicture(undefined);
        setcreateErrors([]);
        setOpen(false)
    }


    return (
        toEditPicture && <Dialog
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

                <DialogTitle>Edit {`${toEditPicture?.title}`}</DialogTitle>
                <form
                    className="register flex w-full h-4/5 "
                    ref={formRef}
                    onSubmit={handleSubmit}
                >
                    <div className="create-form-left w-1/2 h-full flex items-center justify-center">
                        <div
                            className={`w-full flex items-center justify-center cursor-pointer rounded-3xl`}
                        >

                            <figure className="h-[400px] w-[300px] flex items-center justify-center flex-col gap-3 ">
                                <img
                                    src={toEditPicture?.image}
                                    alt="your_upload"
                                    className="max-h-full max-w-full object-contain"

                                />

                            </figure>
                        </div>
                    </div>

                    <div className="create-form-right flex flex-col gap-4 px-6 h-full w-1/2 justify-center">
                        <TextField
                            id="outlined-basic"
                            label="Title"
                            variant="outlined"
                            name="title"
                            defaultValue={toEditPicture?.title}
                        />
                        {/* TODO - floating label */}
                        <Textarea
                            className='border border-gray-300 p-3'
                            placeholder="Description"
                            name="description"
                            defaultValue={toEditPicture?.description}
                        />

                        {

                            <Select
                                isMulti
                                options={options}
                                className="basic-multi-select cursor-pointer"
                                classNamePrefix="select"
                                menuShouldScrollIntoView={false}
                                value={selectedCategories}
                                onChange={handleSelectChange}
                            />
                        }

                        {
                            createErrors && <div className="error-message text-theme max-w-full my-4">
                                {createErrors[0]}
                            </div>
                        }
                        <button
                            className="bg-theme hover:bg-themeDarker text-white text-lg font-bold py-2 px-4 rounded-full transition duration-300 mt-3"
                        >
                            {

                                loading ? <BeatLoader color="white" size={10} margin={0} /> : 'Edit'
                            }
                        </button >
                    </div>


                </form >
            </div >

        </Dialog >
    )
}