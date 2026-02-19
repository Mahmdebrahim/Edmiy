import React from "react";

import { dummyTestimonial } from "../../assets/assets";
import { Rating } from "primereact/rating";

function Testimonials() {
  return (
    <div className="pb-14 md:px-40 px-8 ">
      <h2 className="text-3xl font-medium text-gray-800 mb-4">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners as they share their journeys of transformation,
        success, and how our platform has made a difference in their lives.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow[0px_4px_15px_0px] shadow-black/5 overflow-hidden "
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                <Rating
                  value={testimonial.rating}
                  readOnly
                  cancel={false}
                  pt={{
                    item: { className: "p-rating-item" }, // اختياري
                    onIcon: {
                      className: "text-yellow-500 !text-yellow-500",
                    },
                    offIcon: {
                      className: "text-gray-300",
                    },
                  }}
                />
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="#" className="text-blue-500 underline px-5">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
