import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { getUserInfoFromToken } from './security/JwtDecoder';


interface InfoRegistration {
  structureName: string | number | readonly string[] | undefined;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  telephone:string;
}


const Account: React.FC = () => {
  const [infoRegistration, setInfoRegistration] = useState<InfoRegistration>({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    telephone:"",
    structureName:""
  });

  useEffect(() => {
    const token = Cookies.get("authToken") || "{}";
    try {
      const user = getUserInfoFromToken(token);
      setInfoRegistration({
        firstname: user.firstName || "",
        lastname: user.lastName || "",
        email: user.email || "",
        role: user.role || "",
        telephone:user.telephone,
        structureName:user.structure?.name
      });
    } catch (error) {
      console.error("Error parsing user data from cookies");
    }
  }, []);

  return (
    <div className="col-span-5 xl:col-span-3">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Informations Personnelles
          </h3>
        </div>
        <div className="p-7">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="prenom">
                Prénom
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="prenom"
                id="prenom"
                value={infoRegistration.firstname}
                disabled
              />
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="nom">
                Nom de Famille
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="nom"
                id="nom"
                value={infoRegistration.lastname}
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="email"
                id="email"
                value={infoRegistration.email}
                disabled
              />
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="cne">
                Role
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="cne"
                id="cne"
                value={infoRegistration.role}
                disabled
              />
            </div>
          </div>
          

          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="telephone">
                Numéro de Téléphone
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="telephone"
                id="telephone"
                value={infoRegistration.telephone}
                disabled
                placeholder="Numéro de Téléphone"
              />
            </div>
            {infoRegistration.role !== "SUPER_PARRAIN" && (
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="telephone">
                    Structure Organisatrice
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="telephone"
                    id="telephone"
                    value={infoRegistration.structureName}
                    disabled
                    placeholder="Numéro de Téléphone"
                  />
                </div>
              )}

          </div>

        </div>
        
      </div>
    </div>
  );
};

export default Account;
