export default function BookCard({
    title,
    author,
    description,
    image,
    category,
    averageRating,
    totalReviews,
    deliveryFee,
}) {
    return (
        <div className="group relative rounded-2xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

            {/* Glow background effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-2xl transition duration-500"></div>

            {/* Image */}
            <div className="overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-52 w-full object-cover transform transition duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="p-5 relative z-10">

                {/* Category Badge */}
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-2">
                    {category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold mb-1 group-hover:text-purple-600 transition">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 mb-1">
                    By {author}
                </p>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {description}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-yellow-500 font-medium">
                        ⭐ {averageRating}
                    </span>

                    <span className="text-gray-400">
                        ({totalReviews} reviews)
                    </span>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-gray-700">
                        Delivery ৳{deliveryFee}
                    </span>

                    {/* Status Button */}
                    <button className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-semibold hover:bg-green-500 hover:text-white transition">
                        Available
                    </button>

                </div>
            </div>
        </div>
    );
}