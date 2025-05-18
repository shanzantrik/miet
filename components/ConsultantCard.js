export default function ConsultantCard({ consultant, onClick }) {
  const { user, bio, categories, ailments, rating, totalRatings } = consultant;

  const averageRating = totalRatings > 0 ? (rating / totalRatings).toFixed(1) : 'New';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">{averageRating}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{bio}</p>

        {categories && categories.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Specializations:</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <span
                  key={category.id}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {ailments && ailments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Areas of Expertise:</h4>
            <div className="flex flex-wrap gap-2">
              {ailments.map(ailment => (
                <span
                  key={ailment.id}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  {ailment.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
