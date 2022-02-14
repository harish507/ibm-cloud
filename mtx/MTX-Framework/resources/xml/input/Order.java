
package input;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * &lt;p&gt;Java class for anonymous complex type.
 * 
 * &lt;p&gt;The following schema fragment specifies the expected content contained within this class.
 * 
 * &lt;pre&gt;
 * &amp;lt;complexType&amp;gt;
 *   &amp;lt;complexContent&amp;gt;
 *     &amp;lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&amp;gt;
 *       &amp;lt;sequence&amp;gt;
 *         &amp;lt;element name="orderno" type="{http://www.w3.org/2001/XMLSchema}int"/&amp;gt;
 *         &amp;lt;element name="ordername" type="{http://www.w3.org/2001/XMLSchema}string"/&amp;gt;
 *         &amp;lt;element name="ponumber" type="{http://www.w3.org/2001/XMLSchema}int"/&amp;gt;
 *         &amp;lt;element name="customerno" type="{http://www.w3.org/2001/XMLSchema}int"/&amp;gt;
 *         &amp;lt;element name="address"&amp;gt;
 *           &amp;lt;complexType&amp;gt;
 *             &amp;lt;complexContent&amp;gt;
 *               &amp;lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&amp;gt;
 *                 &amp;lt;sequence&amp;gt;
 *                   &amp;lt;element name="streetno" type="{http://www.w3.org/2001/XMLSchema}string"/&amp;gt;
 *                 &amp;lt;/sequence&amp;gt;
 *               &amp;lt;/restriction&amp;gt;
 *             &amp;lt;/complexContent&amp;gt;
 *           &amp;lt;/complexType&amp;gt;
 *         &amp;lt;/element&amp;gt;
 *       &amp;lt;/sequence&amp;gt;
 *     &amp;lt;/restriction&amp;gt;
 *   &amp;lt;/complexContent&amp;gt;
 * &amp;lt;/complexType&amp;gt;
 * &lt;/pre&gt;
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "orderno",
    "ordername",
    "ponumber",
    "customerno",
    "address"
})
@XmlRootElement(name = "order")
public class Order {

    protected int orderno;
    @XmlElement(required = true)
    protected String ordername;
    protected int ponumber;
    protected int customerno;
    @XmlElement(required = true)
    protected Order.Address address;

    /**
     * Gets the value of the orderno property.
     * 
     */
    public int getOrderno() {
        return orderno;
    }

    /**
     * Sets the value of the orderno property.
     * 
     */
    public void setOrderno(int value) {
        this.orderno = value;
    }

    /**
     * Gets the value of the ordername property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOrdername() {
        return ordername;
    }

    /**
     * Sets the value of the ordername property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOrdername(String value) {
        this.ordername = value;
    }

    /**
     * Gets the value of the ponumber property.
     * 
     */
    public int getPonumber() {
        return ponumber;
    }

    /**
     * Sets the value of the ponumber property.
     * 
     */
    public void setPonumber(int value) {
        this.ponumber = value;
    }

    /**
     * Gets the value of the customerno property.
     * 
     */
    public int getCustomerno() {
        return customerno;
    }

    /**
     * Sets the value of the customerno property.
     * 
     */
    public void setCustomerno(int value) {
        this.customerno = value;
    }

    /**
     * Gets the value of the address property.
     * 
     * @return
     *     possible object is
     *     {@link Order.Address }
     *     
     */
    public Order.Address getAddress() {
        return address;
    }

    /**
     * Sets the value of the address property.
     * 
     * @param value
     *     allowed object is
     *     {@link Order.Address }
     *     
     */
    public void setAddress(Order.Address value) {
        this.address = value;
    }


    /**
     * &lt;p&gt;Java class for anonymous complex type.
     * 
     * &lt;p&gt;The following schema fragment specifies the expected content contained within this class.
     * 
     * &lt;pre&gt;
     * &amp;lt;complexType&amp;gt;
     *   &amp;lt;complexContent&amp;gt;
     *     &amp;lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&amp;gt;
     *       &amp;lt;sequence&amp;gt;
     *         &amp;lt;element name="streetno" type="{http://www.w3.org/2001/XMLSchema}string"/&amp;gt;
     *       &amp;lt;/sequence&amp;gt;
     *     &amp;lt;/restriction&amp;gt;
     *   &amp;lt;/complexContent&amp;gt;
     * &amp;lt;/complexType&amp;gt;
     * &lt;/pre&gt;
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "", propOrder = {
        "streetno"
    })
    public static class Address {

        @XmlElement(required = true)
        protected String streetno;

        /**
         * Gets the value of the streetno property.
         * 
         * @return
         *     possible object is
         *     {@link String }
         *     
         */
        public String getStreetno() {
            return streetno;
        }

        /**
         * Sets the value of the streetno property.
         * 
         * @param value
         *     allowed object is
         *     {@link String }
         *     
         */
        public void setStreetno(String value) {
            this.streetno = value;
        }

    }

}
