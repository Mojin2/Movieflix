# TypeScript 이용한 ToDo application

Typescript + react-hook-form + recoil 연습
<br><br>

## 🖥️ 프로젝트 소개

- 커스텀 카테고리를 제공하는 todo앱

### ⏱️ 프로젝트 기간

- 2023.5.21~

### ⚙️ 프로젝트 환경

- **react** 18.2.0
- **react-hook-from** : 7.34.9
- **typescript** : 4.9.5
- **recoil** : 0.7.7
- **recoil-persist** : 4.2.0

### 🗓️ 프로젝트 진행

- atom을 통한 todoList 관리 ✅
- custom 카테고리 추가 기능 ✅
- custome 카테고리 조건부 입력
- local storage를 이용한 persistence ✅
- styled components이용 css구성 50% ✅
- animation 적용
  <br><br><br>

# Other tips

## ❗️ React 프로젝트 생성 with TypeScript

    npx create-react-app app --template typescript
    npm i styled-components@5.3.6
    npm i --save-dev @types/styled-components
    npm i recoil
    npm i react-router-dom@5.3
    npm i framer-motion
    npm i react-query
    npm i react-hook-form

## useRouteMatch

- Current Route에 따른 변화를 주고 싶을때

```
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/Tv");
  <Link to="/">Home {homeMatch?.isExact && <Circle />}</Link>
  <Link to="/Tv">Tv Shows {tvMatch && <Circle />}</Link>


```

## React-Query

```
import { QueryClient, QueryClientProvider } from "react-query";
const client = new QueryClient();
<QueryClientProvider client={client}>
    <App />
</QueryClientProvider>
```

- fetcher function

```
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}
  const { data, isLoading } = useQuery(["movies", "nowPlaying"], getMovies);

```
