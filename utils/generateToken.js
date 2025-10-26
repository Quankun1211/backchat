import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d'
  })

  // res.cookie('jwt', token, {
  //   maxAge: 30 * 24 * 60 * 60 * 1000,
  //   httpOnly: true, // Prevent XSS attacks cross-site scripting attacks
  //   sameSite: "strict",
  //   secure: process.env.NODE_ENV !== "development"
  // })
  res.cookie('jwt', token, {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
  httpOnly: true, // Chống XSS
  sameSite: "none", // BẮT BUỘC cho cross-site (Netlify → Render)
  secure: true,     // BẮT BUỘC khi sameSite: "none" và HTTPS
});
}

export default generateTokenAndSetCookie
