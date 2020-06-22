import React from "react";

export const ProfilePageUser = ({ user: { name, image } }) => (
  <div>
    <img src={image} alt="Profilbild" />
    Hej {name}
  </div>
);
