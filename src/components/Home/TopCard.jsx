import Image from "next/image";

const TopCard = ({ title, number, icon, bg }) => {
  return (
    <div
      className="flex p-6 items-center justify-between rounded-md h-[157px]"
      style={{ background: bg }}
    >
      <div className="flex flex-col space-y-2">
        <span className="text-xl md:text-3xl font-normal font-poppins text-[#474747]">
          {title}
        </span>
        <span className="text-2xl md:text-4xl font-semibold font-poppins text-[#264798]">
          {number}
        </span>
      </div>
      <Image src={icon} width={60} height={60} className="md:w-[85px] md:h-[85px]" />
    </div>
  );
};

export default TopCard;
