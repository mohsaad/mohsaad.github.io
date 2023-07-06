---
layout: post
title: What does a neural net think your Pokemon is?
tags: [projects]
---

I've always had an obsession with the game Pokemon, and I played it obsessively as a kid. They also had a pretty cool show that would host a Pokedex, a device which could recognize Pokemon by pointing a camera at it. With my growing up (and a deeper understanding of neural networks, the thing that powers most AI engines today) I was convinced to try to build one.

Before building a Pokedex, I had several options. I could try and train a model myself, using the data I had. I rejected this because I had a small amount of training data (sprites from the several generations of Pokemon, ~7 per class or so) which would end up overfitting the data horribly. A better and faster way to do this would be to use Principal Component Analysis + Multi-Class Support Vector Machine (PCA + SVM). That's a post for later.

For now, I was playing around with the [MxNet framework](https://mxnet.incubator.apache.org/) and decided to see what a neural net thinks a Pokemon is. MxNet has a really easy way of loading pre-trained models, which is basically to download the model, load it into the CPU/GPU, and then call a forward function. [1] Here's an example (to download and run the VGG-Net model):

```python
path='http://data.mxnet.io/models/imagenet/'
[mx.test_utils.download(path+'vgg/vgg19-symbol.json', dirname = 'vgg/'),
 mx.test_utils.download(path+'vgg/vgg19-0000.params', dirname = 'vgg/'),
 mx.test_utils.download(path+'synset.txt', dirname = 'vgg/')]
```

Here, the JSON file represents the individual layers that make up VGG-Net, while the `params` file represents the weights at each of the layers. The synset.txt is the names of each of the classes.

Next, we load the model into our GPU:

```python
sym, arg_params, aux_params = mx.model.load_checkpoint('vgg/vgg-19', 0)
mod = mx.mod.Module(symbol = sym, context = mx.gpu(), label_names = None)
mod.bind(for_training=False, data_shapes=[('data', (1,3,224,224))],
            label_shapes=mod._label_shapes)

mod.set_params(arg_params, aux_params, allow_missing=True)
with open('vgg/synset.txt', 'r') as f:
    labels = [l.rstrip() for l in f]
```

We load the symbols and parameters into the `sym`, `arg_params`, and `aux_params` variables, and then create a model on our GPU representing each of these. We then tell the model that we're not retraining, and to use an input data shape of $$1\times3\times224\times224$$, or a single RGB image of size $$224\times224$$.

Next, we load an image from the filesystem, resize it to the correct size, and reshape it:

```python
def get_pokemon_image(filename):
    img = cv2.cvtColor(cv2.imread(filename), cv2.COLOR_BGR2RGB)
    if img is None:
        return None

    img = cv2.resize(img, (224, 224))
    img = np.swapaxes(img, 0, 2)
    img = np.swapaxes(img, 1, 2)
    img = img[np.newaxis, :]
    return img
```

Finally, we can pass it through our neural network to get a prediction. Note that we get a prediction for all the classes, but we only display the top 5:

```python
mod.forward(Batch([mx.nd.array(img)]))
prob = mod.get_outputs()[0].asnumpy()
# print the top-5
prob = np.squeeze(prob)
a = np.argsort(prob)[::-1]

print(name)
print('---------------------------------')
for i in a[0:5]:
    print('probability=%f, class=%s' %(prob[i], labels[i]))
    f.write('%s,%f,%s\n' % (name, prob[i], labels[i]))
print('---------------------------------')
```

For this excercise, I decided to use two pretrained models, VGG-Net [2] and ResNet-200 [3], both trained on the ImageNet dataset. The ImageNet dataset has 1000 classes, ranging from `hook` to `nematode`. I scraped some images off of [Serebii.net](https://serebii.net/), using the Sun & Moon sprites as my test images. I tried both the VGG-Net and ResNet-200 models, to see what the outputs would be. The results are... interesting. (Open in New Tab to zoom in)

#### VGG-Net
![Pokemon Image 1](http://mohsaad.com/imgs/vgg_25_pokemon.png)

#### ResNet-200
![Pokemon Image 2](http://mohsaad.com/imgs/resnet200_126_151_pokemon.png)

As you can see, nothing makes sense! There's a couple of them where they kinda look like what they're supposed to, but most of the predictions are well off-base. As they should be - the data we're pulling from has very few examples, and in this case, probably underfit the data quite a bit. A straight pretrained network probably isn't the best use case for this, but we can take these networks, shave off the last layer, and use those extracted features to classify the Pokemon. This is called transfer learning, and it's what we're going to be using to build our PokeDex!

### Code

The code can be found [here](https://github.com/mohsaad/dex-vision).

### Next up
* Classifying Pokemon the old-school way
* Building a feature extractor using a pretrained model, and classifying the Pokemon that way
* The Pokemon dataset!

### References
[1]&#58; https://mxnet.incubator.apache.org/tutorials/python/predict_image.html

[2]&#58; http://www.robots.ox.ac.uk/~vgg/research/very_deep/

[3]&#58; https://arxiv.org/pdf/1512.03385v1.pdf
