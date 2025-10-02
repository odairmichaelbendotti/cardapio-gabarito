import { Calendar, Clock, User } from "lucide-react";

type CardPedido = {
  id: number;
  cliente: string;
  price: string;
  createdAt: Date | null;
  deliveredAt: Date;
  status: string;
  changeOrderStatus: (id: number, novoStatus: string) => void;
};

const CardPedido = ({
  id,
  cliente,
  createdAt,
  price,
  status,
  deliveredAt,
  changeOrderStatus,
}: CardPedido) => {
  return (
    <div className="w-full bg-[#F2DAAC] px-4 py-3 rounded-md text-[#32343E]">
      <div className="flex items-center justify-between">
        <p>#{id}</p>
        <select
          name="status"
          className="px-2 rounded-md p-1"
          onChange={(e) => changeOrderStatus(id, e.target.value)}
          value={status}
        >
          <option value="Pendente" disabled defaultChecked>
            Pendente
          </option>
          <option value="Retirado">Retirado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div className="flex items-center gap-2 mt-4 font-thin">
        <User size={14} />
        <p className="text-sm">{cliente}</p>
      </div>

      <div className="flex items-center gap-2 mt-1 font-thin">
        <Calendar size={14} />
        <p className="text-sm">
          {createdAt !== null
            ? new Date(createdAt).toLocaleDateString("pt-BR")
            : "-"}
        </p>
      </div>

      <div className="flex items-center gap-10 mt-1 font-thin">
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <p className="text-sm">
            {createdAt !== null
              ? new Date(createdAt).toLocaleTimeString("pt-BR")
              : "-"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <p className="text-sm">
            {deliveredAt === null
              ? "-"
              : new Date(deliveredAt).toLocaleTimeString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#32343E] mt-4 mb-1"></div>
      <p className="text-right text-lg">{price}</p>
    </div>
  );
};

export default CardPedido;
