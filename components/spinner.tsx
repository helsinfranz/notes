import classes from "./spinner.module.css";

export default function Spinner(): JSX.Element {
  return (
    <div className={`${classes.spinner} ${classes.center}`}>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
      <div className={classes.spinner_blade}></div>
    </div>
  );
}
