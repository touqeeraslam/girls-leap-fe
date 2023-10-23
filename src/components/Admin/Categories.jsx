import { useContext, useEffect, useState } from "react";
import Spinner from "../Loading/Spinner";
import adminContext from "../../context/admin/adminContext";
import ButtonLoader from '../Loading/ButtonLoader';

const Categories = ()=>{

    const context = useContext(adminContext);

    const {categories, imageHost, addCategory, getcategories, showToastMessage, editCategoryById, deleteCategoryById, packages, getPackages} = context;

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [delCategory, setDelCategory] = useState("");
    const [showDelModal, setShowDelModal] = useState(false);
    const [oldPictureSource, setOldPictureSource] = useState("");
    const [categoryThumbnail, setCategoryThumbnail] = useState();

    const [editCategory, setEditCategory] = useState({
        _id: "",
        name: "",
        description: "",
        active: "",
        slug: "",
        subPackage: ""
    });

    const [category, setcategory] = useState({
        name: "",
        description: "",
        active: "",
        slug: "",
        subPackage: ""
    });

    useEffect(() => {
        setLoading(true);
        if(categories.length === 0){
            getcategories();
        }

        if(packages.length === 0){
            getPackages();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [])

    const addOrUpdateCategory = async (e)=>{
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        if(editCategory._id){
            // fields validations
            if(editCategory.name.length === 0 || editCategory.description.length === 0 || editCategory.slug.length === 0){
                showToastMessage("Please fill out all fields!","warning");
                return;
            }

            if(!editCategory.subPackage){
                showToastMessage("Please select a subscription package!","warning");
                return;
            }

            if(editCategory.active === "on"){
                editCategory.active = true;
            }else if(editCategory.active === "off" || editCategory.active === ""){
                editCategory.active = false;
            }

            data.append("title",editCategory.name);
            data.append("description",editCategory.description);
            data.append("active",editCategory.active);
            data.append("slug",editCategory.slug);
            data.append("subPackage",editCategory.subPackage);
            data.append("thumbnail",categoryThumbnail);

            let modifyCategory = await editCategoryById(data,editCategory._id);

            if(modifyCategory){
                closeModal();
            }

        }else{

            // validations
            if(category.name.length === 0 || category.description.length === 0 || category.slug.length === 0){
                showToastMessage("Please fill out all fields!","warning");
                return;
            }

            if(!category.subPackage){
                showToastMessage("Please select a subscription package!","warning");
                return;
            }

            if(!categoryThumbnail){
                showToastMessage("Please select a thumbnail image file!","warning");
                return;
            }

            if(category.active === "on"){
                category.active = true;
            }else if(category.active === "off" || category.active === ""){
                category.active = false;
            }

            data.append("title",category.name);
            data.append("description",category.description);
            data.append("active",category.active);
            data.append("slug",category.slug);
            data.append("subPackage",category.subPackage);
            data.append("thumbnail",categoryThumbnail);
            
            let saveCategory = await addCategory(data);

            if(saveCategory){
                closeModal();
            }
        }
        setLoading(false);
    }

    const onChange = (e)=>{
        setcategory({...category, [e.target.name] : e.target.value});
        setEditCategory({...editCategory, [e.target.name] : e.target.value});
    }

    const closeModal = ()=>{
        setEditCategory({
            _id: "",
            name: "",
            description: "",
            active: "",
            subPackage: ""
        });

        setcategory({
            name: "",
            description: "",
            active: "",
            subPackage: ""
        });

        setOldPictureSource("");

        setShowModal(false);
    }

    const editCategoryModal = (id)=>{
        const selectedCateogry = categories.filter(category => category._id === id);
        setEditCategory({
            _id: selectedCateogry[0]._id,
            name: selectedCateogry[0].title,
            description: selectedCateogry[0].description,
            active: selectedCateogry[0].active,
            thumbnail: selectedCateogry[0].thumbnail,
            subPackage: selectedCateogry[0].package,
            slug: selectedCateogry[0].slug
        });
        setOldPictureSource(`${imageHost}/${selectedCateogry[0].thumbnail}`);
        setShowModal(true);
    }
   
    const onChangeActive = ()=>{
        if(editCategory.active === true || editCategory.active === "on"){
            editCategory.active = false;
        }else{
            editCategory.active = true;
        }

        if(category.active === true || category.active === "on"){
            category.active = false;
        }else{
            category.active = true;
        }
    }
    
    const deleteCategory = async ()=>{
        if(delCategory.length > 0){
            setLoading(true);
            let delResult = deleteCategoryById(delCategory);
            if(delResult){
                setShowDelModal(false);
            }
            setDelCategory("");
            setLoading(false);
        }
    }

    function convertToSlug(Text) {
        return Text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    } 
    
    const updateSlug = ()=>{
        let title = editCategory.name;
        let slug = convertToSlug(title);
        setcategory({...category, "slug" : slug});
        setEditCategory({...editCategory, "slug" : slug});
    }
    
    return (
        <>
            {
                <div>
                    <div className="p-4 sm:ml-64">
                        <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
                            <div className="mb-4">
                                <h1 className="mt-2 font-serif text-2xl font-bold text-white">Categories</h1>
                                <div className="flex justify-end">
                                    <button className="bg-blue-300 flex items-center p-2 text-base text-black font-bold py-2 px-4 rounded"
                                        onClick={()=>{setShowModal(true)}}
                                    >
                                        <svg className="svg-icon" viewBox="0 0 20 20"><path d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path> </svg>
                                        <span className="ml-3">Create</span>
                                    </button>
                                </div>
                                {
                                    showDelModal ? 
                                    <>
                                    <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                    <h3 className="text-xl font-semibold">
                                                        Are you sure you want to delete this Category?
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-end mt-4 mb-2 mx-2">
                                                    <button 
                                                        onClick={()=>{
                                                            setShowDelModal(false);
                                                            setDelCategory("");
                                                        }}
                                                    className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={loading}
                                                        onClick={()=>{
                                                            deleteCategory();
                                                        }}
                                                        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        {
                                                            loading ? <ButtonLoader/> : "Confirm"
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </> : null
                                }
                                {showModal ? (
                                    <>
                                        <div
                                            className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                            <div className="relative w-auto my-6 mx-auto max-w-3xl w-auto">
                                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                        <h3 className="text-3xl font-semibold">
                                                            Category
                                                        </h3>
                                                        <button
                                                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                            onClick={() => closeModal()} > x </button>
                                                    </div>
                                                    <div className="relative p-6 flex-auto">
                                                        <form className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Name
                                                                </label>
                                                                <input onChange={onChange} value={editCategory.name} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    onBlur={updateSlug} id="name" type="text" name="name" placeholder="Name" />
                                                            </div>
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2 lg:w-[500px] md:w-1/2" htmlFor="name">
                                                                    Slug
                                                                </label>
                                                                <input onChange={onChange} value={editCategory.slug || ''} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    id="slug" type="text" name="slug" placeholder="Slug..."/>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                                                    Description
                                                                </label>
                                                                <textarea  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    onChange={onChange} value={editCategory.description} name="description" id="description" type="text" placeholder="Description...">
                                                                </textarea>
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">
                                                                    Thumbnail
                                                                </label>
                                                                {
                                                                    oldPictureSource.length > 0 && 
                                                                    <div className="flex flex-row items-center mx-2">
                                                                        <p>Old Profile Picture: </p>
                                                                        <img className="h-10 w-10" src={oldPictureSource} alt=""/>
                                                                    </div>
                                                                }
                                                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                                                    name="thumbnail" id="thumbnail" type="file" accept=".jpg, .jpeg, .png"
                                                                    onChange={(e)=>{setCategoryThumbnail(e.target.files[0])}}
                                                                />
                                                            </div>
                                                            <div className="mb-6">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                                                    Package
                                                                </label>
                                                                <select defaultValue={editCategory.subPackage} id="subPackage" name="subPackage" onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        packages.length > 0 && packages.map((item)=>{
                                                                            return <option key={item._id} value={item._id}>{item.title}</option>
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center mb-4">
                                                                <input onChange={onChangeActive} defaultChecked={editCategory.active} type="checkbox" name="active" id="active" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                                                <label htmlFor="active" className="ml-2 block text-gray-700 text-sm font-bold">Active</label>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <button
                                                                    disabled={loading}
                                                                    onClick={addOrUpdateCategory}
                                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                                    {
                                                                        loading === true ? 
                                                                        <ButtonLoader/> : "Save"
                                                                    }
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                    </>
                                    ) : null}
                            </div>
                            {loading ?
                            <Spinner />            
                            :
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-white dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Description
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Active
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            categories.map((category)=>{
                                                return <tr key={category._id} className="bg-black border-b dark:bg-gray-900 dark:border-gray-700">
                                                    <td className="px-6 py-4">
                                                        {category.title}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {
                                                            category.description.length > 50 ? `${category.description.substring(0,50)}...` : category.description
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {
                                                            category.active === true ? "Yes" : "No"
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button onClick={()=>{
                                                            editCategoryModal(category._id);
                                                        }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Edit </button>  
                                                        <span className="mx-1">
                                                            |
                                                        </span>
                                                        <button onClick={()=>{
                                                            setShowDelModal(true);
                                                            setDelCategory(category._id);
                                                        }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline"> Delete </button>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    );

}

export default Categories;