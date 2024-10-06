import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import { imageUpload } from "../../../api/utils";
import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";
import  { useMutation } from '@tanstack/react-query'
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
function AddRooms() {
  const axiosSecure =  useAxiosSecure()
  const navigate = useNavigate()
  const { user,loading, setLoading } = useAuth();
  const [imagePreview,setImagePreview] = useState()
  const [imageText,setImageText] = useState('Upload Image')
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleDates = (range) => {
    setDates(range.selection);
  };

  const {mutateAsync} = useMutation({
    mutationFn: async (roomData)=>{
     const {data} = await axiosSecure.post(`/room`,roomData)
     return data
    },
    onSuccess:()=>{
      toast.success('Room added successfully')
      navigate('/dashboard/my-listings')
      setLoading(false)
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const to = dates.endDate;
    const from = dates.startDate;
    const price = form.price.value;
    const guest = form.total_guest.value;
    const bathrooms = form.bathrooms.value;
    const description = form.description.value;
    const bedrooms = form.bedrooms.value;
    const image = form.image.files[0];

    const host = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    };

    try {
      const image_url = await imageUpload(image);
      const roomData = {
        location,
        category,
        title,
        to,
        from,
        guest,
        price,
        bathrooms,
        bedrooms,
        description,
        host,
        image: image_url,
      };
      console.table(roomData)
      await mutateAsync(roomData)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  };

  const handleImage = (image)=>{
    setImagePreview(URL.createObjectURL(image))
    setImageText(image.name)
  }
  return (
    <div>
      <Helmet>
        <title>Addroom | Dashborad</title>
      </Helmet>
      <AddRoomForm
        dates={dates}
        handleDates={handleDates}
        handleSubmit={handleSubmit}
        handleImage={handleImage}
        imageText = {imageText}
        imagePreview = {imagePreview}
        loading={loading}
      ></AddRoomForm>
    </div>
  );
}

export default AddRooms;
