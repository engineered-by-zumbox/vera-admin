import Link from "next/link";

const ContentCard = () => {
  return (
    <div className="min-w-[432px] p-4 myFlex gap-7 max-w-[432px] h-[285px] bg-white rounded-3xl">
      <div className="basis-1/2 h-full">
        <img
          src="/images/project1.jpg"
          alt="interiot image"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
      <div className="basis-1/2">
        <div className="mt-7 mb-5 grid gap-2">
          <h3 className="text-xl font-semibold">Bathroom Projects</h3>
          <p className="text-myGray">October 10</p>
        </div>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Integer
        </p>
        <div className="mt-4 myFlex gap-5 justify-end">
          <Link href="/edit" className="text-[#9E8437] font-semibold">
            Edit
          </Link>
          <button className="text-[#CD3D3D] font-semibold">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
