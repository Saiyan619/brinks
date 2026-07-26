
// best practices for writing zustand stores in React:
// this is works but is not the best practice for writing Zustand stores in React.
// becuase it can lead to unnecessary re-renders and performance issues
// what i mean is when you destructure the state directly in the conponent like this it can cause the component to re-render every time any part of the state changes, even if the specific piece of state you care about hasn't changed.
// A better approach is to use a selector function when accessing the state, which allows you to only subscribe to the specific pieces of state that your component needs. This can help reduce unnecessary re-renders and improve performance.
// const {count, increment} = useCounterStore((state) => state); 
// so the better solution is to use a selector function when accessing the state, which allows you to only subscribe to the specific pieces of state that your component needs. This can help reduce unnecessary re-renders and improve performance:
// const count = useCounterStore((state) => state.count);

// another good practice is to make the store modular e.g authstore, chatstore, userstore etc. and then combine them into a single store using the combine function from zustand. This can help keep your code organized and make it easier to manage state across different parts of your application.

