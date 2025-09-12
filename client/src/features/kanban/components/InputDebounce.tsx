import clsx from "clsx";
import { memo, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface InputDebounceProps {
  initValue: string;
  setInitValue: (value: string) => void;
  className?: string;
}

const InputDebounce = ({
  initValue,
  setInitValue,
  className,
}: InputDebounceProps) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  useEffect(() => {
    // Không chạy khi component mount hoặc khi giá trị đã khớp
    if (value === initValue || !value) {
      return;
    }
    const timerId = setTimeout(() => {
      // Gọi mutate với dữ liệu mới nhất
      setInitValue(value.trim());
    }, 500);

    // Hàm dọn dẹp: Hủy timer cũ nếu boardName thay đổi
    return () => {
      clearTimeout(timerId);
    };
  }, [value, initValue]);

  return (
    <TextareaAutosize
      className={clsx([
        `resize-none w-full bg-transparent rounded-lg px-3 py-1.5`,
        className,
      ])}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter title"
    />
  );
};

export default memo(InputDebounce);
