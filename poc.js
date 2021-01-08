function foo(a) {
  let y = 0x7fffffff;  // 2^31 - 1

  if (a == NaN) y = NaN;

  if (a) y = -1;

  let z = y + 1; // z = 2147483648, feedback type = Range(0, 2147483647)
  z >>= 31; // z = -1, feedback type = Range(0, 0)

  // Attempt to create an array with size -1
  // Since z is typed as Range(0, 0), TurboFan will attempt to run this code
  // and hit a trap in optimized code (since an array with size -1 cannot be
  // created)
  let arr = new Array(z);
}

// Compile with SignedSmall type feedback
for (var i = 0; i < 10000; i++) {
  foo(true);
}

// Now trigger the bug and cause hit the trap
foo(false);
