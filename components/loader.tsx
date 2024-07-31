import classes from "./loader.module.css";

export default function Loader(): JSX.Element {
  return (
    <div className={classes.loaderHolder}>
      <div className={classes.loader}>
        <div className={classes.loaderFingers}></div>
        <div className={classes.loaderFingers}></div>
        <div className={classes.loaderFingers}></div>
        <div className={classes.loaderFingers}></div>
        <div className={classes.loaderShadow}></div>
        <div className={classes.loaderThumb}></div>
      </div>
    </div>
  );
}
