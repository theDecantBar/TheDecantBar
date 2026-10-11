--
-- PostgreSQL database dump
--

\restrict B5bhRdmq4qXuNoX7ESSOvA3joiGR20pNOsxERFK0bFfdWtgKy6zz9Erzi9tutbu

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    product_name character varying(255) NOT NULL,
    size_ml integer NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    image_url text
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_number character varying(50) NOT NULL,
    user_id integer,
    customer_name character varying(255) NOT NULL,
    customer_email character varying(255) NOT NULL,
    customer_phone character varying(50) NOT NULL,
    shipping_address text NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    pincode character varying(20) NOT NULL,
    payment_method character varying(50) DEFAULT 'cod'::character varying,
    order_notes text,
    subtotal numeric(10,2) NOT NULL,
    shipping_fee numeric(10,2) DEFAULT 99,
    total_amount numeric(10,2) NOT NULL,
    order_status character varying(50) DEFAULT 'Confirmed'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    product_id integer NOT NULL,
    size_ml integer NOT NULL,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    active boolean DEFAULT true
);


--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    brand character varying(150),
    description text,
    image_url text,
    category character varying(100),
    gender character varying(50),
    weather character varying(100),
    type character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    full_bottle_price numeric(10,2)
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    password_hash character varying(255) NOT NULL,
    address text,
    city character varying(100),
    state character varying(100),
    pincode character varying(20),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_admin boolean DEFAULT false
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, product_name, size_ml, price, quantity, image_url) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, city, state, pincode, payment_method, order_notes, subtotal, shipping_fee, total_amount, order_status, created_at) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, product_id, size_ml, price, stock, active) FROM stdin;
1	1	2	499.00	20	t
2	1	5	999.00	20	t
3	1	10	1799.00	20	t
4	2	2	499.00	20	t
5	2	5	999.00	20	t
6	2	10	1799.00	20	t
10	4	2	399.00	0	t
11	4	5	749.00	0	t
12	4	10	1399.00	0	t
13	5	2	499.00	0	t
14	5	5	849.00	0	t
15	5	10	1499.00	0	t
16	6	2	499.00	0	t
17	6	5	849.00	0	t
18	6	10	1499.00	0	t
19	7	2	499.00	0	t
20	7	5	849.00	0	t
21	7	10	1499.00	0	t
22	8	2	499.00	0	t
23	8	5	849.00	0	t
24	8	10	1499.00	0	t
25	10	2	749.00	0	t
26	10	5	1499.00	0	t
27	10	10	2849.00	0	t
28	11	2	849.00	0	t
29	11	5	1549.00	0	t
30	11	10	2999.00	0	t
31	12	2	649.00	0	t
32	12	5	1349.00	0	t
33	12	10	2499.00	0	t
34	13	2	649.00	0	t
35	13	5	1349.00	0	t
36	13	10	2499.00	0	t
37	14	2	649.00	0	t
38	14	5	1349.00	0	t
39	14	10	2499.00	0	t
43	16	2	249.00	0	t
44	16	5	499.00	0	t
45	16	10	899.00	0	t
46	17	2	249.00	0	t
47	17	5	499.00	0	t
48	17	10	899.00	0	t
49	18	2	299.00	0	t
50	18	5	499.00	0	t
51	18	10	899.00	0	t
52	19	2	299.00	0	t
53	19	5	499.00	0	t
54	19	10	899.00	0	t
55	20	2	299.00	0	t
56	20	5	499.00	0	t
57	20	10	899.00	0	t
58	21	2	299.00	0	t
59	21	5	499.00	0	t
60	21	10	899.00	0	t
64	23	2	299.00	0	t
65	23	5	499.00	0	t
66	23	10	899.00	0	t
67	24	2	299.00	0	t
68	24	5	499.00	0	t
69	24	10	899.00	0	t
70	25	2	299.00	0	t
71	25	5	499.00	0	t
72	25	10	899.00	0	t
73	26	2	249.00	0	t
74	26	5	399.00	0	t
75	26	10	699.00	0	t
76	27	2	249.00	0	t
77	27	5	399.00	0	t
78	27	10	699.00	0	t
79	28	2	249.00	0	t
80	28	5	399.00	0	t
81	28	10	699.00	0	t
82	29	2	249.00	0	t
83	29	5	399.00	0	t
84	29	10	699.00	0	t
85	30	5	249.00	0	t
86	30	10	399.00	0	t
87	31	2	599.00	0	t
88	31	5	999.00	0	t
89	31	10	1649.00	0	t
90	33	2	599.00	0	t
91	33	5	999.00	0	t
92	33	10	1649.00	0	t
93	34	2	299.00	0	t
94	34	5	499.00	0	t
95	34	10	899.00	0	t
96	35	2	299.00	0	t
97	35	5	499.00	0	t
98	35	10	899.00	0	t
99	36	2	179.00	0	t
100	36	5	399.00	0	t
101	36	10	699.00	0	t
102	37	2	449.00	0	t
103	37	5	999.00	0	t
104	37	10	1649.00	0	t
105	38	2	449.00	0	t
106	38	5	999.00	0	t
107	38	10	1649.00	0	t
108	39	2	299.00	0	t
109	39	5	499.00	0	t
110	39	10	849.00	0	t
111	40	2	349.00	0	t
112	40	5	749.00	0	t
113	40	10	1299.00	0	t
114	41	2	449.00	0	t
115	41	5	999.00	0	t
116	41	10	1649.00	0	t
117	42	2	399.00	0	t
118	42	5	749.00	0	t
119	42	10	1399.00	0	t
120	43	2	449.00	0	t
121	43	5	799.00	0	t
122	43	10	1449.00	0	t
123	44	2	399.00	0	t
124	44	5	749.00	0	t
125	44	10	1399.00	0	t
126	45	2	249.00	0	t
127	45	5	449.00	0	t
128	45	10	749.00	0	t
129	46	5	299.00	0	t
130	46	10	499.00	0	t
131	47	5	349.00	0	t
132	47	10	599.00	0	t
133	48	2	449.00	0	t
134	48	5	999.00	0	t
135	48	10	1649.00	0	t
136	49	2	379.00	0	t
137	49	5	749.00	0	t
138	49	10	1499.00	0	t
139	50	2	379.00	0	t
140	50	5	749.00	0	t
141	50	10	1499.00	0	t
142	51	2	249.00	0	t
143	51	5	399.00	0	t
144	51	10	699.00	0	t
145	52	2	299.00	0	t
146	52	5	649.00	0	t
147	52	10	1199.00	0	t
148	53	2	599.00	0	t
149	53	5	1799.00	0	t
150	53	10	2999.00	0	t
151	54	2	1199.00	0	t
152	54	5	2499.00	0	t
153	54	10	3999.00	0	t
154	55	5	599.00	0	t
155	55	10	846.00	0	t
156	56	5	299.00	0	t
157	56	10	499.00	0	t
158	57	2	249.00	0	t
159	57	5	479.00	0	t
160	57	10	799.00	0	t
161	58	2	249.00	0	t
162	58	5	479.00	0	t
163	58	10	799.00	0	t
164	59	2	249.00	0	t
165	59	5	479.00	0	t
166	59	10	799.00	0	t
167	60	2	249.00	0	t
168	60	5	479.00	0	t
169	60	10	799.00	0	t
170	61	2	249.00	0	t
171	61	5	479.00	0	t
172	61	10	799.00	0	t
173	62	2	249.00	0	t
174	62	5	479.00	0	t
175	62	10	799.00	0	t
176	63	2	249.00	0	t
177	63	5	479.00	0	t
178	63	10	799.00	0	t
179	64	2	249.00	0	t
180	64	5	479.00	0	t
181	64	10	799.00	0	t
182	65	5	269.00	0	t
183	65	10	459.00	0	t
184	65	20	849.00	0	t
185	65	50	1799.00	0	t
186	66	5	269.00	0	t
187	66	10	459.00	0	t
188	66	20	849.00	0	t
189	66	50	1799.00	0	t
190	67	5	269.00	0	t
191	67	10	459.00	0	t
192	67	20	849.00	0	t
193	67	50	1799.00	0	t
194	68	5	239.00	0	t
195	68	10	429.00	0	t
196	68	20	649.00	0	t
197	68	50	1199.00	0	t
198	69	5	249.00	0	t
199	69	10	449.00	0	t
200	69	20	699.00	0	t
201	69	50	1499.00	0	t
202	70	5	279.00	0	t
203	70	10	449.00	0	t
204	70	20	799.00	0	t
205	70	50	1649.00	0	t
206	71	5	279.00	0	t
207	71	10	449.00	0	t
208	71	20	799.00	0	t
209	71	50	1649.00	0	t
210	72	5	260.00	0	t
211	72	10	429.00	0	t
212	72	20	649.00	0	t
213	72	50	1499.00	0	t
214	73	5	320.00	0	t
215	73	10	539.00	0	t
216	73	20	849.00	0	t
217	73	50	1999.00	0	t
218	74	5	270.00	0	t
219	74	10	449.00	0	t
220	74	20	749.00	0	t
221	74	50	1499.00	0	t
222	75	5	270.00	0	t
223	75	10	449.00	0	t
224	75	20	749.00	0	t
225	75	50	1499.00	0	t
226	76	5	270.00	0	t
227	76	10	449.00	0	t
228	76	20	749.00	0	t
229	76	50	1499.00	0	t
230	77	5	270.00	0	t
231	77	10	449.00	0	t
232	77	20	749.00	0	t
233	77	50	1499.00	0	t
234	78	5	270.00	0	t
235	78	10	449.00	0	t
236	78	20	749.00	0	t
237	78	50	1499.00	0	t
238	79	5	270.00	0	t
239	79	10	449.00	0	t
240	79	20	749.00	0	t
241	79	50	1499.00	0	t
242	80	5	270.00	0	t
243	80	10	449.00	0	t
244	80	20	749.00	0	t
245	80	50	1499.00	0	t
246	81	5	270.00	0	t
247	81	10	449.00	0	t
248	81	20	749.00	0	t
249	81	50	1499.00	0	t
250	82	5	270.00	0	t
251	82	10	449.00	0	t
252	82	20	749.00	0	t
253	82	50	1499.00	0	t
254	83	5	270.00	0	t
255	83	10	449.00	0	t
256	83	20	749.00	0	t
257	83	50	1499.00	0	t
258	84	5	270.00	0	t
259	84	10	449.00	0	t
260	84	20	749.00	0	t
261	84	50	1499.00	0	t
262	85	5	249.00	0	t
263	85	10	399.00	0	t
264	85	20	649.00	0	t
265	85	50	1349.00	0	t
266	86	5	299.00	0	t
267	86	10	519.00	0	t
268	86	20	959.00	0	t
269	86	50	2499.00	0	t
270	87	5	249.00	0	t
271	87	10	399.00	0	t
272	87	20	649.00	0	t
273	87	50	1499.00	0	t
274	88	5	249.00	0	t
275	88	10	399.00	0	t
276	88	20	649.00	0	t
277	88	50	1499.00	0	t
278	89	5	249.00	0	t
279	89	10	399.00	0	t
280	89	20	649.00	0	t
281	89	50	1499.00	0	t
282	90	5	249.00	0	t
283	90	10	399.00	0	t
284	90	20	649.00	0	t
285	90	50	1499.00	0	t
286	91	5	249.00	0	t
287	91	10	399.00	0	t
288	91	20	649.00	0	t
289	91	50	1499.00	0	t
290	92	5	249.00	0	t
291	92	10	399.00	0	t
292	92	20	649.00	0	t
293	92	50	1499.00	0	t
294	93	5	399.00	0	t
295	93	10	749.00	0	t
296	93	20	1199.00	0	t
297	93	50	2999.00	0	t
298	94	5	399.00	0	t
299	94	10	749.00	0	t
300	94	20	1199.00	0	t
301	94	50	2999.00	0	t
302	95	5	399.00	0	t
303	95	10	749.00	0	t
304	95	20	1199.00	0	t
305	95	50	2999.00	0	t
306	96	5	399.00	0	t
307	96	10	749.00	0	t
308	96	20	1199.00	0	t
309	96	50	2999.00	0	t
310	97	5	399.00	0	t
311	97	10	749.00	0	t
312	97	20	1199.00	0	t
313	97	50	2999.00	0	t
314	98	5	399.00	0	t
315	98	10	749.00	0	t
316	98	20	1199.00	0	t
317	98	50	2999.00	0	t
318	99	5	399.00	0	t
319	99	10	749.00	0	t
320	99	20	1199.00	0	t
321	99	50	2999.00	0	t
322	100	5	399.00	0	t
323	100	10	749.00	0	t
324	100	20	1199.00	0	t
325	100	50	2999.00	0	t
326	101	5	399.00	0	t
327	101	10	749.00	0	t
328	101	20	1199.00	0	t
329	101	50	2999.00	0	t
61	22	2	899.00	20	t
62	22	5	1999.00	20	t
63	22	10	3499.00	20	t
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, brand, description, image_url, category, gender, weather, type, created_at, full_bottle_price) FROM stdin;
2	Bleu de Chanel	Chanel	An elegant woody aromatic fragrance.	/images/perfumes/IMG_9652.JPG.jpeg	Woody	Men	All Season	EDP	2026-10-09 10:21:03.683816	\N
52	Blue de chanel edp	\N	\N	/images/perfumes/IMG_9652.JPG.jpeg	Designer	M	Winter/Summer	EDP	2026-10-09 10:22:42.43595	\N
1	Sauvage	Dior	A fresh and bold fragrance.	/images/perfumes/IMG_9631.WEBP	Fresh	Men	Summer	EDP	2026-10-09 10:21:03.683816	\N
18	Valentino born in roma green stravaganza	\N	\N	/images/perfumes/IMG_9677.JPG.jpeg	Designer	M	Summer	EDT	2026-10-09 10:22:42.43595	\N
26	YSL Y	\N	\N	/images/perfumes/IMG_9684.JPG.jpeg	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
16	Azzaro most wanted Intense	\N	\N	/images/perfumes/IMG_9643.AVIF	Designer	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
12	Creed Irish	\N	\N	/images/perfumes/IMG_9617.AVIF	Niche	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
14	Creed orijinal vetivar	\N	\N	/images/perfumes/IMG_9619.AVIF	Niche	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
39	Dior sauvage Parfum	\N	\N	/images/perfumes/IMG_9631.WEBP	Designer	M	Winter/summer	PARFUM	2026-10-09 10:22:42.43595	\N
61	Maison Margiela REPLICA BEACH WALK	\N	\N	/images/perfumes/IMG_9604.JPG.jpeg	NICHE	W	Summer	EDT	2026-10-09 10:22:42.43595	\N
57	Maison Margiela REPLICA By the fire place	\N	\N	/images/perfumes/IMG_9608.AVIF	NICHE	M/W	Winter	EDT	2026-10-09 10:22:42.43595	\N
62	Maison Margiela REPLICA DANCING ON THE MOON	\N	\N	/images/perfumes/IMG_9611.AVIF	NICHE	M/W	Summer	EDT	2026-10-09 10:22:42.43595	\N
64	Maison Margiela REPLICA Flower Market	\N	\N	/images/perfumes/IMG_9606.JPG.jpeg	NICHE	M/W	Summer	EDT	2026-10-09 10:22:42.43595	\N
59	Maison Margiela REPLICA JazzClub	\N	\N	/images/perfumes/IMG_9609.JPG.jpeg	NICHE	M	Winter	EDT	2026-10-09 10:22:42.43595	\N
58	Maison Margiela REPLICA Lazy sunday morning	\N	\N	/images/perfumes/IMG_9603.AVIF	NICHE	M/W	Summer	EDT	2026-10-09 10:22:42.43595	\N
63	Maison Margiela REPLICA SAILING DAY	\N	\N	/images/perfumes/IMG_9610.JPG.jpeg	NICHE	M/W	Summer	EDT	2026-10-09 10:22:42.43595	\N
60	Maison Margiela REPLICA WHEN THE RAIN STOP	\N	\N	/images/perfumes/IMG_9605.JPG.jpeg	NICHE	W	Summer	EDT	2026-10-09 10:22:42.43595	\N
45	Spicebomb viktor rolf	\N	\N	/images/perfumes/IMG_9642.AVIF	Designer	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
7	Tom ford tuscan leather	\N	\N	/images/perfumes/TomFordTuscan.webp	Designer	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
9	Tomford Grey Vetiver	\N	\N	/images/perfumes/greyVitever.jpg	\N	\N	\N	\N	2026-10-09 10:22:42.43595	\N
20	Valentino coral	\N	\N	/images/perfumes/IMG_9676.PNG	Designer	M	Winter	EDT	2026-10-09 10:22:42.43595	\N
19	Valentino men Uomo	\N	\N	/images/perfumes/IMG_9675.AVIF	Designer	M	summeer/winter	EDT	2026-10-09 10:22:42.43595	\N
30	Versace pour homme	\N	\N	/images/perfumes/IMG_9627.AVIF	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
17	Azzaro most wanted night	\N	\N	/images/perfumes/IMG_9622.JPG.jpeg	Designer	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
56	Bentley intense	\N	\N	/images/perfumes/IMG_9643.AVIF	Designer	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
65	French avenue Baie EDP	\N	\N	/images/perfumes/IMG_9612.WEBP	Middle eastern	W	Summer	EDP	2026-10-09 10:22:42.43595	\N
66	french vulcan feu	\N	\N	/images/perfumes/IMG_9613.WEBP	Middle eastern	M/W	Summer	EDP	2026-10-09 10:22:42.43595	3899.00
35	Gentlemen givenchy paris	\N	\N	/images/perfumes/IMG_9666.WEBP	Designer	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
50	Marly castley	\N	\N	/images/perfumes/MarleyCastley.jpg	Niche	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
8	Tomford white suede	\N	\N	/images/perfumes/whiteSuede.jpg	Designer	W	Summer	EDP	2026-10-09 10:22:42.43595	\N
68	turathi electric	\N	\N	/images/perfumes/Turathi.webp	Middle eastern	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
91	9PM ELIXER	\N	\N	/images/perfumes/IMG_9687.JPG.jpeg	Middle eastern	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
67	french vulcan sable brown	\N	\N	/images/perfumes/IMG_9693.WEBP	Middle eastern	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
34	Gentlemen givenchy boise	\N	\N	/images/perfumes/GentlemanBoise.avif	Designer	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
46	Invictus victory exterme	\N	\N	/images/perfumes/IMG_9655.PNG	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
49	Marly layton	\N	\N	/images/perfumes/IMG_9647.JPG.jpeg	Niche	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
4	Tomford ombre leather	\N	\N	/images/perfumes/IMG_9614.WEBP	Designer	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
89	9PM night out	\N	\N	/images/perfumes/IMG_9762.JPG.jpeg	Middle eastern	M/W	Winter/summer	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
69	Turathi blue	\N	\N	/images/perfumes/turathiBlue.webp	Middle eastern	M	Summer	EDP	2026-10-09 10:22:42.43595	3500.00
92	Liquid Brun	\N	\N	/images/perfumes/liquidBrown.webp	Middle eastern	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
21	Valentino men born in roma	\N	\N	/images/perfumes/IMG_9678.JPG.jpeg	Designer	M	Winter	EDT	2026-10-09 10:22:42.43595	\N
101	Mexican Tobacco	\N	\N	/images/perfumes/MexicanTobacco.jpg	Middle eastern	M/W	Winter	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
99	Cuban Tobacco	\N	\N	/images/perfumes/CubanTobacco.webp	Middle eastern	M/W	Winter	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
100	Jamaican Tobacco	\N	\N	/images/perfumes/JamaicanTobacco.webp	Middle eastern	M/W	Winter	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
93	Greek Tobacco	\N	\N	/images/perfumes/GreekTobacco.webp	Middle eastern	M/W	Winter	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
94	Brazilian Tobacco	\N	\N	/images/perfumes/BrazillianTobacco.png	Middle eastern	M/W	Winter	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
97	Tobacco Extrait de Parfum	\N	\N	/images/perfumes/ARABIANTOBACCO.webp	Middle eastern	M	Winter	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
95	Spanish Tobacco	\N	\N	/images/perfumes/spanishTobacco.webp	Middle eastern	M/W	Winter	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
96	French Tobacco	\N	\N	/images/perfumes/frenchTobacco.webp	Middle eastern	M/W	Summer	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
98	Dominican Tobacco	\N	\N	/images/perfumes/dominicanTobacco.webp	Middle eastern	M/W	Winter	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
6	Tomford ebume fume	\N	\N	/images/perfumes/TomFordEbene.avif	Designer	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
90	9AM Dive	\N	\N	/images/perfumes/IMG_9668.JPG.jpeg	Middle eastern	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
74	Hawas Ice	\N	\N	/images/perfumes/IMG_9594.WEBP	Middle eastern	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
75	Hawas tropical	\N	\N	/images/perfumes/IMG_9595.JPG.jpeg	Middle eastern	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
76	Hawas for him	\N	\N	/images/perfumes/IMG_9596.JPG.jpeg	Middle eastern	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
77	Hawas elixer	\N	\N	/images/perfumes/IMG_9597.JPG.jpeg	Middle eastern	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
78	Hawas Fire	\N	\N	/images/perfumes/IMG_9598.JPG.jpeg	Middle eastern	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
81	Hawas Malibu	\N	\N	/images/perfumes/IMG_9599.JPG.jpeg	Middle eastern	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
79	Hawas verde	\N	\N	/images/perfumes/IMG_9600.JPG.jpeg	Middle eastern	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
80	Hawas black	\N	\N	/images/perfumes/IMG_9601.JPG.jpeg	Middle eastern	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
82	Hawas kobra	\N	\N	/images/perfumes/IMG_9602.WEBP	Middle eastern	M	Summer/winter	EDP	2026-10-09 10:22:42.43595	\N
5	Tomford ombre leather parfum	\N	\N	/images/perfumes/IMG_9614.WEBP	Designer	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
10	Creed aventus	\N	\N	/images/perfumes/IMG_9615.JPG.jpeg	Niche	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
11	Creed aventus absolu	\N	\N	/images/perfumes/IMG_9616.WEBP	Niche	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
13	Creed mountain silver	\N	\N	/images/perfumes/IMG_9618.JPG.jpeg	Niche	M/W	Summer/winter	EDP	2026-10-09 10:22:42.43595	\N
28	Versace eros	\N	\N	/images/perfumes/IMG_9625.JPG.jpeg	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
29	versace flame	\N	\N	/images/perfumes/IMG_9626.JPG.jpeg	Designer	M	Summer/winter	EDP	2026-10-09 10:22:42.43595	\N
32	Kilian angle share	\N	\N	/images/perfumes/IMG_9628.JPG.jpeg	Niche	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
31	Kilian blue moon	\N	\N	/images/perfumes/IMG_9629.JPG.jpeg	Niche	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
33	kilian roses on ice	\N	\N	/images/perfumes/IMG_9630.JPG.jpeg	Niche	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
38	Christian Dior Gris dior	\N	\N	/images/perfumes/IMG_9632.WEBP	Niche	M/W	Winter/Summer	EDP	2026-10-09 10:22:42.43595	\N
37	Christian Dior oud isphan	\N	\N	/images/perfumes/IMG_9633.JPG.jpeg	Niche	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
41	Dior sauvage elixer	\N	\N	/images/perfumes/IMG_9634.WEBP	Designer	M	Winter/summer	ELIXER	2026-10-09 10:22:42.43595	\N
40	Dior homme intense parfum	\N	\N	/images/perfumes/IMG_9635.JPG.jpeg	Designer	M	Winter	PARFUM	2026-10-09 10:22:42.43595	\N
44	Xerjoff Erba Pura	\N	\N	/images/perfumes/IMG_9644.JPG.jpeg	Niche	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
43	Xerjoff Naxos	\N	\N	/images/perfumes/IMG_9645.PNG	Niche	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
42	Xerjoff Accento	\N	\N	/images/perfumes/IMG_9646.JPG.jpeg	Niche	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
53	Oud Stallion	\N	\N	/images/perfumes/IMG_9649.JPG.jpeg	Niche	M	Winter	Extrait de parfum	2026-10-09 10:22:42.43595	\N
54	ROJA Harrods	\N	\N	/images/perfumes/IMG_9650.WEBP	Niche	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
55	Armani code	\N	\N	/images/perfumes/IMG_9651.WEBP	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
51	Mont blac explorar	\N	\N	/images/perfumes/IMG_9653.JPG.jpeg	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
48	Roberto canvalli splendid vanilla	\N	\N	/images/perfumes/IMG_9654.JPG.jpeg	Designer	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
47	Invictus legend	\N	\N	/images/perfumes/IMG_9657.WEBP	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
22	Baccarat rouge 540	\N	\N	/images/perfumes/IMG_9658.WEBP	Niche	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
87	Afnan 9PM	\N	\N	/images/perfumes/IMG_9663.JPG.jpeg	Middle eastern	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
71	Armaf omb d'or	\N	\N	/images/perfumes/IMG_9664.WEBP	Middle eastern	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
86	Jean Lowe ombre	\N	\N	/images/perfumes/IMG_9669.WEBP	Middle eastern	M	Winter	EDP	2026-10-09 10:22:42.43595	5000.00
83	lattafa khamrah qahwa	\N	\N	/images/perfumes/IMG_9671.WEBP	Middle eastern	M/W	Winter	EDP	2026-10-09 10:22:42.43595	\N
84	sharaf blend the club	\N	\N	/images/perfumes/IMG_9673.JPG.jpeg	Middle eastern	M	Summer/winter	EDP	2026-10-09 10:22:42.43595	\N
85	sharaf blend	\N	\N	/images/perfumes/IMG_9674.WEBP	Middle eastern	M/W	Summer	EDP	2026-10-09 10:22:42.43595	\N
25	YSL Homme cologne blue	\N	\N	/images/perfumes/IMG_9680.JPG.jpeg	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
23	YSL L Homme	\N	\N	/images/perfumes/IMG_9681.WEBP	Designer	M	Winter	EDP	2026-10-09 10:22:42.43595	\N
24	YSL L Homme Le Parfum	\N	\N	/images/perfumes/IMG_9682.JPG.jpeg	Designer	M	Summer	EDP	2026-10-09 10:22:42.43595	\N
27	YSL myself L'abslou parfum	\N	\N	/images/perfumes/IMG_9684.JPG.jpeg	Designer	M	Summer	PARFUM	2026-10-09 10:22:42.43595	\N
88	9PM ELIXER	\N	\N	/images/perfumes/IMG_9687.JPG.jpeg	Middle eastern	M/W	Summer	EXTRAIT DE PARFUM	2026-10-09 10:22:42.43595	\N
72	Afnan supermacy not only intense	\N	\N	/images/perfumes/IMG_9695.JPG.jpeg	Middle eastern	M	Summer	EDP	2026-10-09 10:22:42.43595	5000.00
73	Afnan supermacy collector edition	\N	\N	/images/perfumes/IMG_9696.WEBP	Middle eastern	M	Summer	EDP	2026-10-09 10:22:42.43595	5000.00
70	Armaf Club de nuit intense	\N	\N	/images/perfumes/IMG_9697.WEBP	Middle eastern	M	Summer	EDT	2026-10-09 10:22:42.43595	4000.00
36	1 Million	\N	\N	/images/perfumes/IMG_9700.JPG.jpeg	Designer	M	Winter	EDT	2026-10-09 10:22:42.43595	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, full_name, email, phone, password_hash, address, city, state, pincode, created_at, updated_at, is_admin) FROM stdin;
1	Nidhish Arora	aroranidhish70@gmail.com	\N	$2b$10$n6BS4BMzAsPZRadfLPschelsShaAbCSdKNO6fcesO8rqhqEiTlp0m	\N	\N	\N	\N	2026-10-11 12:43:51.943582+05:30	2026-10-11 12:43:51.943582+05:30	f
\.


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 969, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 297, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_product_id_size_ml_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_size_ml_key UNIQUE (product_id, size_ml);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict B5bhRdmq4qXuNoX7ESSOvA3joiGR20pNOsxERFK0bFfdWtgKy6zz9Erzi9tutbu

