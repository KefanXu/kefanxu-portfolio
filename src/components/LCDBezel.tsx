import React from 'react';

type LCDBezelProps = {
  children: React.ReactNode;
  /** Extra classes applied to the outer rim container */
  outerClassName?: string;
  /** Extra classes applied to the inner trench container */
  trenchClassName?: string;
  /** Tailwind radius class for the outer rim */
  outerRadiusClassName?: string;
  /** Tailwind radius class for the inner trench */
  trenchRadiusClassName?: string;
  /** Padding between trench and the screen content */
  trenchPaddingClassName?: string;
};

export const LCDBezel: React.FC<LCDBezelProps> = ({
  children,
  outerClassName = '',
  trenchClassName = '',
  outerRadiusClassName = 'rounded-2xl',
  trenchRadiusClassName = 'rounded-[14px]',
  trenchPaddingClassName = 'p-[3px]',
}) => {
  return (
    <div
      className={[
        'relative p-[2px] bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark',
        outerRadiusClassName,
        outerClassName,
      ].join(' ')}
    >
      <div
        className={[
          'relative bg-bg-light dark:bg-bg-dark',
          'shadow-[inset_3px_3px_6px_0_rgba(163,177,198,0.30),inset_-3px_-3px_6px_0_rgba(255,255,255,0.60)]',
          'dark:shadow-[inset_2px_2px_5px_#1d1e22,inset_-2px_-2px_5px_#393c44]',
          trenchRadiusClassName,
          trenchPaddingClassName,
          trenchClassName,
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
};

