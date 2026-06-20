
export const imageUpload = async (image) => {
    const formData = new FormData();
    formData.append('image', image);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=e8545852ae3085d59eebf8f5b85321fc`, {
        method: 'POST',
        body: formData
    });
    const data = await res.json();
    return data?.data;
};
