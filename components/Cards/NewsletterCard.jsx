import Link from "next/link";

const NewsletterCard = () => {
  return (
    <div className="max-w-[300px] min-w-[300px] bg-white min-h-[381px] rounded-3xl p-4">
      <img
        src="/images/project1.jpg"
        alt="project"
        className="w-full h-[123px] rounded-3xl object-cover"
      />
      <div className="mt-7 mb-5 grid gap-2">
        <h3 className="text-xl font-semibold">Bathroom Projects</h3>
        <p className="text-myGray">October 10</p>
      </div>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. Integer
      </p>
      <div className="mt-4 myFlex gap-5 justify-end">
        <Link href="/newsletter/edit" className="text-[#9E8437] font-semibold">
          Edit
        </Link>
        <button className="text-[#CD3D3D] font-semibold">Delete</button>
      </div>
    </div>
  );
};

export default NewsletterCard;
