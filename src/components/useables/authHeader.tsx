import Link from "next/link";
import React from "react";

const AuthHeader = () => {
  return (
    <header className="container mx-auto px-4 md:px-10 lg:px-14 py-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-2xl font-bold text-primary">EmergFund</h1>
      </Link>
    </header>
  );
};

export default AuthHeader;
