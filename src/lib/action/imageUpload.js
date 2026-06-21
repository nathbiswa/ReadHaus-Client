
export const imageUpload = async (image) => {
    const formData = new FormData();
    formData.append('image', image);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_KEY}`, {
        method: 'POST',
        body: formData
    });
    const data = await res.json();
    return data?.data?.url || null;
};
