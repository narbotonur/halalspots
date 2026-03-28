type Props = {
  name: string;
  rating: number;
  address: string;
  onClick?: () => void;
  isSelected?: boolean;
};

export const PlaceCard = ({
  name,
  rating,
  address,
  onClick,
  isSelected = false,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={`w-full text-left rounded-[24px] border p-4 bg-white transition hover:shadow-lg cursor-pointer ${
        isSelected
          ? "border-purple-500 ring-2 ring-purple-200"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[24px] leading-none font-semibold text-[#1f1f1f]">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-3">{address}</p>
        </div>

        <div className="rounded-full bg-[#f5e7ff] px-3 py-1 text-sm font-medium text-[#b026ff]">
          ⭐ {rating}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="h-[72px] flex-1 rounded-2xl bg-[#ececec]" />
        <div className="h-[72px] flex-1 rounded-2xl bg-[#ececec]" />
        <div className="h-[72px] flex-1 rounded-2xl bg-[#ececec]" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          className="flex-1 rounded-full bg-gradient-to-r from-[#c92df1] to-[#a92dff] py-3 text-white font-medium"
        >
          Reserve a spot
        </button>

        <button
          type="button"
          className="h-12 w-12 rounded-2xl bg-[#c92df1] text-white text-lg"
        >
          📷
        </button>
      </div>
    </div>
  );
};