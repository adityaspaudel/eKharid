"use client";

import { useRouter } from "next/navigation";
import React from "react";

const Home = () => {
  const { userId } = useRouter();

  return <div>Home</div>;
};

export default Home;
