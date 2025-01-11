import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { AuthContext } from "../Provider/AuthProvider";

const WishList = () => {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/wishlist?email=${user.email}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };

    if (user?.email) {
      fetchWishlist();
    }
  }, [user?.email]);

  // Handle Remove Item
  const handleRemove = async (itemId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/wishlist/${itemId}`
      );
      if (res.data.deletedCount > 0) {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Item removed from Wishlist!",
          showConfirmButton: true,
        });
        setData((prevData) => prevData.filter((item) => item._id !== itemId));
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  // Table Columns
  const columns = [
    {
      name: "No.",
      selector: (row, index) => index + 1
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link
            to={`/blogs/${row.blogId}`}
            className="px-5 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition duration-200"
          >
            Details
          </Link>
          <button
            onClick={() => handleRemove(row._id)}
            className="px-5 py-2 rounded-md ml-2 text-white bg-pink-600 hover:bg-pink-700 transition duration-200"
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-8">
      <h1 className="text-4xl font-bold text-center mb-8">Your Wishlist</h1>
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          responsive
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#6a5acd",
                color: "white", // White text for header
                fontWeight: "bold",
                fontSize: "16px",
                padding: "12px 8px",
              },
            },
            cells: {
              style: {
                padding: "12px 8px",
                fontSize: "16px",
                textAlign: "center", 
              },
            },
            rows: {
              style: {
                "&:hover": {
                  backgroundColor: "#f3e8ff",
                },
              },
            },
            pagination: {
              style: {
                backgroundColor: "#f3e8ff",
                padding: "10px 0",
                borderTop: "1px solid #d1d5db",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default WishList;