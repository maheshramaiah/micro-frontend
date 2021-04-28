import React from 'react';
import { Link } from 'react-router-dom';

export default function Home2() {
  return (
    <div>
      Home2 <Link to="/home1">Go back</Link>
    </div>
  );
}
