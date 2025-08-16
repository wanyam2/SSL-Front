import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SignupPage.module.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: "",
    password: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [memberInfo, setMemberInfo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMemberInfo(null);

    try {
      // ✅ 회원가입
      const signupRes = await axios.post(
        "https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app/api/members/signup",
        form
      );

      const memberId = signupRes.data?.id;
      if (!memberId) throw new Error("회원가입 응답에 id가 없습니다.");

      // ✅ 로그인 (닉네임 + 패스워드)
      await axios.post(
        "https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app/api/members/login",
        {
          nickname: form.nickname,
          password: form.password,
        }
      );

      // localStorage 저장
      localStorage.setItem("memberId", memberId);

      // ✅ 회원 정보 조회
      const memberRes = await axios.get(
        `https://port-0-ll-ssl-backend-umnqdut2blqqevwyb.sel4.cloudtype.app/api/members/${memberId}`
      );

      setMemberInfo(memberRes.data);

      alert("회원가입 및 로그인 완료!");
      navigate("/checklist");
    } catch (err) {
      console.error("Signup/Login failed", err.response?.data || err.message);
      setError("회원가입 또는 로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원가입</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={form.nickname}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="전화번호"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "가입 중..." : "가입하기"}
        </button>
      </form>

      {memberInfo && (
        <div className={styles.infoBox}>
          <h3>가입된 회원 정보</h3>
          <p>ID: {memberInfo.id}</p>
          <p>닉네임: {memberInfo.nickname}</p>
          <p>전화번호: {memberInfo.phoneNumber}</p>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
