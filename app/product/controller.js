const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    console.log(req.file);


    // update karena relasi dengan category
    if (payload.category) {
      let category =
        await Category
          .findOne({ name: { $regex: payload.category, $options: 'i' } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.length > 0) {
      let tags =
        await Tag
          .findOne({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map(tag => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: 'Tidak ada gambar yang diupload'
      })
    }
    let target_path = req.file.path;

    let product = new Product({ ...payload, image_url: target_path });;
    await product.save()
    return res.status(201).json({
      status: 201,
      data: product
    })
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }

    next(err);
  }
}

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;

    if (payload.category) {
      let category =
        await Category
          .findOne({ name: { $regex: payload.category, $options: 'i' } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let tags =
        await Tag
          .find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map(tag => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let product = await Product.findById(id)
          console.log(product);

          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`


          console.log(currentImage);
          console.log(fs.existsSync(currentImage))

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
          }


          console.log(payload);
          payload.image_url = filename

          product = await Product.findByIdAndUpdate({ _id: id }, payload, { new: true, runValidators: true });
          return res.json(
            product
          )
        } catch (error) {
          fs.unlinkSync(target_path)
          if (error && error.name === "ValidationError") {
            return res.json({
              error: 1,
              message: error.message,
              fields: error.errors
            })
          }
          next(error);
        }
      })

      src.on('error', async () => {
        next(error)
      })


    } else {

      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
      });
      return res.json(product);

    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }

    next(err);
  }
}

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10, q = '', category = '', tags = [] } = req.query;

    let criteria = {};

    if (q.length > 3) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: 'i' }
      }
    }

    if (category.length) {
      let categoryResult = await Category.findOne({ name: { $regex: new RegExp(category, 'i') } });

      if (categoryResult) {
        criteria = { ...criteria, category: categoryResult._id }
      }
    }

    if (tags.length) {
      let tagsResult = await Tag.find({ name: { $in: tags } });
      if (tagsResult.length > 0) {
        criteria = { ...criteria, tags: { $in: tagsResult.map(tag => tag._id) } }
      }
    }

    let count = await Product.find(criteria).countDocuments();

    let product = await Product
      .find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('category')
      .populate('tags');
    return res.json({
      data: product,
      count
    });
  } catch (err) {
    next(err);
  }
}

const destroy = async (req, res, next) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id);
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage)
    }

    return res.json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  store,
  index,
  update,
  destroy
}