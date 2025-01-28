import { useTranslation } from 'react-i18next';
import Guidee from '../../../../public/Guidee.pdf';

export const Steps: React.FC = () => {
  const { t } = useTranslation(); // Use the translation hook
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-white uppercase rounded-full bg-primary">
            {t('steps.stepsTitle')}
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-primary sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="d0d83814-78b6-480f-9a5f-7f637616b267"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#d0d83814-78b6-480f-9a5f-7f637616b267)"
                width="40"
                height="24"
              />
            </svg>
            <span className="relative">
              {t('steps.heroSubtitle1')}
            </span>
          </span>
        </h2>
      </div>
      <div className="relative grid gap-8 row-gap-5 mb-8 md:row-gap-8 lg:grid-cols-3 sm:grid-cols-2">
        <div className="absolute inset-0 flex items-center justify-center sm:hidden lg:flex">
          <div className="w-px h-full bg-gray-300 lg:w-full lg:h-px" />
        </div>
        <div className="p-5 duration-300 transform bg-white border rounded shadow-sm hover:-translate-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5 text-primary">{t('steps.createAccount')}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded bg-secondary text-white">
              1
            </p>
          </div>

        </div>
        <div className="p-5 duration-300 transform bg-white border rounded shadow-sm hover:-translate-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5 text-primary">{t('steps.step2')}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded bg-secondary text-white">
              2
            </p>
          </div>

        </div>
        <div className="p-5 duration-300 transform bg-white border rounded shadow-sm hover:-translate-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5 text-primary">{t('steps.step3')}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded bg-secondary text-white">
              3
            </p>
          </div>

        </div>
        <div className="p-5 duration-300 transform bg-white border rounded shadow-sm hover:-translate-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5 text-primary">{t('steps.step4')}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded bg-secondary text-white">
              4
            </p>
          </div>
        </div>
        <div className="p-5 duration-300 transform bg-white border rounded shadow-sm hover:-translate-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold leading-5 text-primary">{t('steps.step5')}</p>
            <p className="flex items-center justify-center w-6 h-6 font-bold rounded bg-secondary text-white">
              5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
