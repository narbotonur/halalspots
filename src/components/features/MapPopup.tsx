type Props = {
  name: string;
};

export const MapPopup = ({ name }: Props) => {
  return (
    <div className="absolute left-1/2 bottom-6 z-[1000] hidden w-[75%] max-w-[520px] -translate-x-1/2 rounded-[32px] border border-gray-100 bg-white p-5 shadow-2xl xl:block">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[32px] leading-none font-semibold text-[#1f1f1f]">
          {name}
        </h3>

        <button className="shrink-0 rounded-full bg-[#f3f3f3] px-4 py-2 text-sm text-gray-700">
          Open in Maps
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="h-[96px] flex-1 rounded-2xl bg-gray-200" />
        <div className="h-[96px] flex-1 rounded-2xl bg-gray-200" />
        <div className="h-[96px] flex-1 rounded-2xl bg-gray-200" />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button className="flex-1 rounded-full bg-gradient-to-r from-[#c92df1] to-[#a92dff] py-4 text-lg font-medium text-white">
          Reserve a spot
        </button>

        <button className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c92df1] text-white text-xl">
          📷
        </button>
      </div>
    </div>
  );
};