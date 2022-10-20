import { Review, User } from "@prisma/client";
import { cls } from "libs/client/utils";
import useSWR from "swr";

type ReviewWithWriter = Review & {
  reviewWriter: User;
};

type ReviewsResponse = {
  ok: boolean;
  reviews: ReviewWithWriter[];
};

const Reviews = () => {
  const { data } = useSWR<ReviewsResponse>("/api/reviews");

  return (
    <>
      {data?.reviews.map(review => (
        <div className="mt-12" key={review.id}>
          <div className="flex space-x-4 items-center">
            <div className="w-12 h-12 rounded-full bg-slate-500" />
            <div>
              <h4 className="text-sm font-bold text-gray-800">{review.reviewWriter.name}</h4>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={cls("h-5 w-5", review.score >= star ? "text-yellow-400" : "text-gray-400")}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 text-gray-600 text-sm">
            <p>{review.review}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Reviews;
