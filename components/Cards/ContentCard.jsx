import Link from "next/link";

const ContentCard = ({ project }) => {
  return (
    <div className="min-w-[432px] p-4 myFlex gap-7 max-w-[432px] h-[285px] bg-white rounded-3xl">
      <div className="basis-1/2 h-full">
        <img
          src={project?.images[0]?.url}
          alt="interiot image"
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
      <div className="basis-1/2 h-full flex flex-col justify-between">
        <div className="grid gap-2">
          <h3 className="text-xl font-semibold">{project?.name}</h3>
          <p className="text-myGray">October 10</p>
        </div>
        <p className="line-clamp-5">{project?.description}</p>
        <div className="myFlex gap-5 justify-end">
          <Link href="/projects/edit" className="text-[#9E8437] font-semibold">
            Edit
          </Link>
          <button className="text-[#CD3D3D] font-semibold">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
