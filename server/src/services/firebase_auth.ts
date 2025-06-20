import {getAuth} from "firebase-admin/auth";
import {cert, initializeApp} from "firebase-admin/app";

const app = initializeApp({
	credential: cert({
		projectId: "cem-cw2",
		clientEmail: "firebase-adminsdk-fbsvc@cem-cw2.iam.gserviceaccount.com",
		privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDntIhkUANvDDmY\nYMHg9+Ett6Vp2UxnFWa97MZUvyZVa9cyQylQgclEy2e7gX9GBN2Ofckv53DxFdCT\nQNAWpqnNrOm5j2TH3cwkr1gQRKP3W8p5ne6KmTsh/XB2GdmRUxFaSr6KRTxqnzWn\nsuipl6le8bRtc9OpjDpjn5SO25p1MHjemgPUUmtQcslb+dy5PYO3yRp6uRHxsgZU\nkluehcMJsUFPrue8v9MTqKFCDZ2HgeFBjcDNx0T3cYClpSD8d0n2xGzv1uNj7QMf\nmlCa2mstXpfK0XAKL9c9z773DTEgkycqeC7Tba0HZsz81bbPYBlUpY+VOGTlpDaJ\nD5FXMUnbAgMBAAECggEAaIV4V2P+wIvPuWzAWNcI5aInxLFo9UFiuP9D0nvt82+z\nwjEoxG/flqB5GU0H2FKejUYxyOHLAX4ZOivtEqK5C5ZaUsIcMMrdaZkNjT0hiBaI\npkb3kd8gnSsiHax4iEVkGQqJnH8yC1jpj841hTdsiG9ZOFydGSkwN7uHfNAUg5Lv\nwt4L4vVCLGHmr0nafrSZOAnQvqvtYGkfcCs+iKa9LbkXVdYY1agvLlZ6i+bTQw5Q\ndkEw13kxYzN1Sdsp0mqY1q9jzOnpZPtopymbcyGSuM8o7RwzA5lonYb+qX4SPOT8\nJtmjqLc5/cdKT2L2ftdFvZJZYcq1HPB+8UraP6ZUEQKBgQD7gPARQ/qgin3A+jrz\n7u1ZyBu65gQQFQIBFDRqyKVTLQLpu5LJccT4sVzYiAqCp0HESHy6o+zGHd9UE2X5\nKZlo9+wrfvjxaGY6VgggoJjcVXv8TqtgmiVHJZ3DLIjdQVgbJWeiKn9dZJJyf6hM\nDNB7KaIn0N62LOTRyeU75fG9SwKBgQDr2PulZFJuSlpxCE/XpPFo59puAedtAEBe\nU9Bw9+oGORCmo4qVeSxDu69UEJtD56dMLJ9wWNjsz67x3w4rD8S5xUenVj32Jglu\nRVUMGZOgxgEz+2V5zmX1z9UnaIEZm6a+GsZ/x8fe22B16nXHm2R+YqPZnlxv3vpE\n8nt4prObsQKBgHhme4bocj0Uz6ron/xTL1FB2PSaVOuWAwWdNJLCR1MQQ0q9v0Gs\ns00TK42FYvK1O2jKAtweyaT2fAl11+V2Irj7pxYTjP2UqwvWT8G+4C7qxZY92xE9\n+gabXXEoCsVRGOq192zMx3hgQzOJJXpy0AOGJNjGxzeTOl+sNY99P0MNAoGACo/q\nHSsUAfp0eHFt2fN6GD+h6aFOMvR67X6FbDm+Ek9F7qCOWUlW8SWboYEo4u6h8Ghj\nL43bESfv5scdhFItdkBeiCD1n2tuqrCSMXuHwAB+F0zf64eRy2NmYWBtv67X1dWv\nJBPXYKSkekNoyOqtondabSmJbD0pKiNN4kZc7tECgYBz+Hs02ON0z+UO2ujA0jPl\nGwqGhnDcTgVSL7baL1J92T+7+rpK0Vmw7Hxmabi0N1KH78pPZADvlecDdgEWI6iO\nt4s8aj6++KaADYeLHyWgLfCGsVMtm6piBMuIYcIbO1OLGFmT6qZElvtv4e8NtxQ5\nv5eRKzeZAbmes5mds/2hGQ==\n-----END PRIVATE KEY-----\n"
	}),
});

// Retrieve services via the defaultApp variable...
const auth = getAuth(app);

export {
	auth
}