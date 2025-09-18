import { useState } from "react";
import { Dropdown } from "./components/Dropdown";

const countries = [
  { label: "Item 1", value: 0 },
  { label: "Item 2", value: 1 },
  { label: "Item 3", value: 2 },
  { label: "Item 4", value: 3 },
];

function App() {
  const [selected, setSelected] = useState<{
    label: string;
    value: number | string;
  } | null>(null);

  // async search example
  const searchCountries = async (query: string) => {
    await new Promise((res) => setTimeout(res, 300));
    return countries.filter((c) =>
      c.label.toLowerCase().includes(query.toLowerCase()),
    );
  };

  return (
    <main className="container mx-auto pt-4">
      <h1 className="text-center text-2xl font-medium uppercase">
        Custom dropdown
      </h1>

      <ul className="mt-2 flex justify-center gap-2">
        <li>
          <h2>1.</h2>
          <Dropdown
            className="mt-2"
            options={countries}
            selected={selected}
            onSelect={setSelected}
            placeholder="Оберіть ваше місто..."
            noResultsText="Нічого не знайдено :("
            searchPlaceholder="Пошук..."
          />
        </li>

        <li>
          <h2>2.</h2>
          <Dropdown
            className="mt-2"
            options={countries}
            customOption={(opt) => (
              <span className="flex items-center gap-2">🙂 {opt.label}</span>
            )}
            customSelected={(opt) => (
              <span>{opt?.label ?? "Оберіть ваше місто"}</span>
            )}
            searchFunction={searchCountries}
            noResultsText="Нічого не знайдено :("
            searchPlaceholder="Пошук..."
          />
        </li>
      </ul>
    </main>
  );
}

export default App;
