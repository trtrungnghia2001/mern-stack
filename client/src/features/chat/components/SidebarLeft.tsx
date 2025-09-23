import ContactCard from "./ContactCard";
import InputSearch from "./InputSearch";

const SidebarLeft = () => {
  return (
    <aside className="p-4 border-r border-r-gray-200 w-64 h-full flex flex-col gap-4">
      <div>
        <div className="Chat font-semibold text-base">Chat</div>
      </div>

      <InputSearch placeholder="Search..." />

      <ul className="overflow-y-auto">
        {Array.from({ length: 20 }).map((_, idx) => (
          <li key={idx}>
            <ContactCard />
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarLeft;
