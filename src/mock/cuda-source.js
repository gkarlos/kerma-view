var data = {
  kernels : [
    { 
      id: 0,
      source : {
        filename : "inputs\\polybench\\cuda\\2MM\\2mm.cu",
        name : "mm2_kernel1",
        signature: "(DATA_TYPE *A, DATA_TYPE *B, DATA_TYPE *C)",
        range: [108,0,120,1]
      },

      launches : [
        {
          id : 0,
          source : {
            range : [195, 1, 195, Infinity],
            params: "<<<grid1,block>>>",
            arguments: "(A_gpu, B_gpu, C_gpu)"
          },
          caller : {
            source : {
              type : "void",
              name : "mm2Cuda",
              signature : "(DATA_TYPE* A, DATA_TYPE* B, DATA_TYPE* C, DATA_TYPE* D, DATA_TYPE* E, DATA_TYPE* E_outputFromGpu)",
            }
          },
          inloop : false
        }
        ,
        {
          id : 1,
          source : {
            range : [197,1,195,Infinity],
            params : "<<<grid2, block>>>",
            arguments : "(C_gpu, D_gpu, E_gpu)"
          },
          caller : {
            source : {
              type : "void",
              name : "mm2Cuda",
              signature : "(DATA_TYPE* A, DATA_TYPE* B, DATA_TYPE* C, DATA_TYPE* D, DATA_TYPE* E, DATA_TYPE* E_outputFromGpu)",
            }
          },
          inloop : false
        }
      ],
      statements : {
        read: [
          {
            source: { from : { row: 112, col: 0}, to: {row: 112, col: 26} },
            reads: [
              { from : {row: 112, col: 6 }, to : {row: 112, col: 7 }, addrspace: "local"},
              { from : {row: 112, col: 10}, to : {row: 112, col: 12}, addrspace: "local"},
              { from : {row: 112, col: 18}, to : {row: 112, col: 19}, addrspace: "local"},
              { from : {row: 112, col: 22}, to : {row: 112, col: 24}, addrspace: "local"}
            ]
          }
        ],
        write: [],

        readwrite: [
          { // int j = ...
            source: { from : { row: 109, col: 0}, to : { row: 109, col: 47} },
            reads : [
              { from: {row: 109, col: 9 }, to: {row: 109, col: 19}, addrspace: "special"},
              { from: {row: 109, col: 22}, to: {row: 109, col: 32}, addrspace: "special"},
              { from: {row: 109, col: 35}, to: {row: 109, col: 46}, addrspace: "special"}
            ],
            writes: [
              { from : { row: 109, col: 0}, to : { row: 109, col: 7}, addrspace: "local"}
            ]
          }
          ,
          { // int i = ...
            source: { from : { row: 110, col: 0}, to :   { row: 110, col: 47} },
            reads : [
              { from: {row: 110, col: 9 }, to: {row: 110, col: 19}, addrspace: "special"},
              { from: {row: 110, col: 22}, to: {row: 110, col: 32}, addrspace: "special"},
              { from: {row: 110, col: 35}, to: {row: 110, col: 46}, addrspace: "special"}
            ],
            writes: [
              { from : { row: 110, col: 0}, to : { row: 125, col: 7}, addrspace: "local"}
            ]
          }
          ,
          { // for ( k = 0; ...)
            source: { from : { row: 115, col: 0}, to :   { row: 115, col: 26} },
            reads: [
              { from: { row: 115, col: 14}, to:   { row: 115, col: 15}, addrspace: "local"},
              { from: { row: 115, col: 18}, to:   { row: 115, col: 20}, addrspace: "local"},
              { from: { row: 115, col: 22}, to:   { row: 115, col: 25}, addrspace: "local"},
            ],
            writes: [
              { from: { row: 115, col: 22}, to:   { row: 115, col: 25}, addrspace: "local"}
            ]
          }
          ,
          {
            source: { from : { row: 117, col: 3}, to : { row: 117, col: 50}},
            reads : [
              { from: {row: 117, col: 3 }, to: {row: 117, col: 16}, addrspace: "global"},
              { from: {row: 117, col: 20}, to: {row: 117, col: 33}, addrspace: "global"},
              { from: {row: 117, col: 36}, to: {row: 117, col: 49}, addrspace: "global"}
            ],
            writes: [
              { from: {row: 117, col: 3 }, to: {row: 133, col: 16}, addrspace: "global"}
            ]
          }
        ]
      }
    }
    ,
    { 
      id: 1,
      source : {
        filename : "inputs\\polybench\\cuda\\2MM\\2mm.cu",
        name: "mm2_kernel2",
        signature: "(DATA_TYPE *C, DATA_TYPE *D, DATA_TYPE *E)",
        range: [123,0,136,1]
      },
      launches : [
        {
          id: 0,
          source : {
            range : [197,1,195,Infinity],
            params : "<<<grid2,block>>>",
            arguments : "(C_gpu, D_gpu, E_gpu)"
          },
          caller : {
            source : {
              type : "void",
              name : "mm2Cuda",
              signature : "(DATA_TYPE* A, DATA_TYPE* B, DATA_TYPE* C, DATA_TYPE* D, DATA_TYPE* E, DATA_TYPE* E_outputFromGpu)",
            }
          },
          inloop : false
        }
      ],
      statements : {
        read: [], 
        write: [],
        readwrite: []
      }
    }
  ]
}

module.exports = data